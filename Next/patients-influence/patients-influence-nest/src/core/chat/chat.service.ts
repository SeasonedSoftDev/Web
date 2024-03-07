import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { CreateChatRoomDto, CreateMessageDto } from './dto';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import securityConfig from 'src/config/security.config';
import { ConfigType } from '@nestjs/config';
import { IUserJwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UserRole } from 'src/utils';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ChatService {
  private messageTimeouts: Map<number, NodeJS.Timeout> = new Map();

  constructor(
    private readonly notificationService: NotificationsService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly prismaService: PrismaService,
    @Inject(securityConfig.KEY)
    private readonly _securityConfig: ConfigType<typeof securityConfig>,
    private readonly jwtService: JwtService,
  ) {}
  platformProductOrderChatRoomIncludeWithLastMessage: Prisma.PlatformProductOrderChatRoomInclude =
    {
      //includes last message, members & productOrder
      productOrderChatRoomMembers: true,
      productOrder: true,
      platformProductOrderChatMessages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          author: {
            include: {
              influencer: true,
            },
          },
        },
      },
    };

  messageTake = 50;

  async pingAdmin(chatRoomId: number, user: IUserJwtPayload) {
    const platformProductOrderChatRoom =
      await this.prismaService.platformProductOrderChatRoom.findUnique({
        where: { id: chatRoomId },
        include: {
          productOrder: {
            select: {
              id: true,
              campaigns: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

    const pingingUser = await this.prismaService.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    const { id: campaignId, name: campaignName } =
      platformProductOrderChatRoom.productOrder.campaigns[0];
    const userFullName = `${pingingUser.firstName} ${pingingUser.lastName}`;
    if (user.role !== UserRole.SuperAdmin) {
      await this.notificationService.pingAdminForChatRoom(
        campaignId,
        campaignName,
        pingingUser.id,
        userFullName,
      );

      return 'Pinged';
    }
  }

  async createMessage(
    createMessageDto: CreateMessageDto,
    user: IUserJwtPayload,
  ) {
    const { chatRoomId, message } = createMessageDto;
    const authorId = user.id;

    const platformChatRoom =
      await this.prismaService.platformProductOrderChatRoom.findUnique({
        where: {
          id: chatRoomId,
        },
        select: {
          id: true,
          productOrderChatRoomMembers: true,
        },
      });

    const chatRoomMembers = platformChatRoom.productOrderChatRoomMembers;

    const newMessage =
      await this.prismaService.platformProductOrderChatMessage.create({
        data: {
          message,
          chatRoom: { connect: { id: chatRoomId } },
          author: { connect: { id: authorId } },
        },
        include: {
          chatRoom: true,
          author: {
            include: {
              influencer: true,
            },
          },
        },
      });

    if (newMessage && chatRoomMembers.length) {
      chatRoomMembers.forEach(async (userInChatRoom) => {
        if (userInChatRoom.userId && newMessage.id) {
          const createdUserReadMessageEntry =
            await this.prismaService.messageRead.create({
              data: {
                isRead: userInChatRoom.userId === authorId,
                platformProductOrderChatMessage: {
                  connect: { id: newMessage.id },
                },
                user: {
                  connect: { id: userInChatRoom.userId },
                },
              },
            });

          if (userInChatRoom.userId !== authorId) {
            const timeouts = this.schedulerRegistry.getTimeouts();
            timeouts.forEach((key) => {
              if (key === `${newMessage.chatRoom.id}${userInChatRoom.userId}`) {
                this.schedulerRegistry.deleteTimeout(
                  `${newMessage.chatRoom.id}${userInChatRoom.userId}`,
                );
              }
            });

            /**  name represents an unique timeout that can be stopped,
             *   this can be used in other places to find the timeout aswell and stop it
             **/
            this.addTimeout(
              createdUserReadMessageEntry.id,
              userInChatRoom.userId,
              `${newMessage.chatRoom.id}${userInChatRoom.userId}`,
              30 * 60 * 1000,
            );
          }

          return createdUserReadMessageEntry;
        }
      });
    }

    return newMessage;
  }

  addTimeout(
    messageReadId: number,
    userId: number,
    name: string,
    milliseconds: number,
  ) {
    const callback = () => {
      this.checkMessageReadStatus(messageReadId, userId);
      // this.logger.warn(`Timeout ${name} executing after (${milliseconds})!`);
    };

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  private async checkMessageReadStatus(messageReadId: number, userId: number) {
    const userMessageRead = await this.prismaService.messageRead.findUnique({
      where: {
        id: messageReadId,
      },
      include: {
        platformProductOrderChatMessage: {
          select: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                email: true,
              },
            },
            chatRoom: {
              select: {
                productOrder: {
                  select: {
                    campaigns: true,
                    surveys: true,
                    client: {
                      select: {
                        id: true,
                        user: {
                          select: {
                            id: true,
                          },
                        },
                      },
                    },
                    platformProductOrderInfluencers: {
                      include: {
                        influencer: {
                          select: {
                            userId: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const messageSenderUserEntity =
      userMessageRead.platformProductOrderChatMessage.author;

    const { campaigns, surveys, platformProductOrderInfluencers, client } =
      userMessageRead.platformProductOrderChatMessage.chatRoom.productOrder;
    if (
      campaigns.length &&
      !surveys.length &&
      messageSenderUserEntity.role === UserRole.Client
    ) {
      // Find influencers of the message group that have unread messages and send it

      const checkedInfluencer = platformProductOrderInfluencers.filter(
        (platformInfluencer) => platformInfluencer.influencer.userId === userId,
      )[0];

      const clientUser = await this.prismaService.user.findUnique({
        where: {
          id: messageSenderUserEntity.id,
        },
        select: {
          id: true,
          firstName: true,
          client: {
            select: {
              company: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (checkedInfluencer && !userMessageRead.isRead) {
        await this.notificationService.campaignMessageUnreadByClient(
          checkedInfluencer.influencer.userId,
          messageSenderUserEntity.id,
          campaigns[0].id,
          clientUser.client.company.name,
        );
      }
    }

    if (
      campaigns.length &&
      !surveys.length &&
      messageSenderUserEntity.role === UserRole.Influencer
    ) {
      // Influencer sends a message and client receives it for campaign

      if (
        userMessageRead.userId === client.user.id &&
        !userMessageRead.isRead
      ) {
        await this.notificationService.campaignMessageUnreadByInfluencer(
          messageSenderUserEntity.id,
          messageSenderUserEntity.firstName,
          client.user.id,
          campaigns[0].id,
          campaigns[0].name,
        );
      }
    }

    if (
      !campaigns.length &&
      surveys.length &&
      messageSenderUserEntity.role === UserRole.Influencer
    ) {
      // Sends message to admin if its unread

      const userFromTheMessage = await this.prismaService.user.findUnique({
        where: {
          id: userMessageRead.userId,
        },
        select: {
          id: true,
          role: true,
        },
      });

      if (
        userFromTheMessage.id === userMessageRead.userId &&
        userFromTheMessage.role === UserRole.SuperAdmin &&
        !userMessageRead.isRead
      )
        await this.notificationService.surveyMessageUnreadByInfluencer(
          messageSenderUserEntity.id,
          surveys[0].id,
          `${messageSenderUserEntity.firstName} ${messageSenderUserEntity.lastName}`,
          surveys[0].name,
        );
    }
  }

  async findChatRoomById(id: number, user: IUserJwtPayload) {
    return await this.prismaService.platformProductOrderChatRoom.findFirstOrThrow(
      {
        where: {
          id,
          productOrderChatRoomMembers: { some: { userId: user.id } }, //only consider chat rooms that the user is member of
        },
        include: this.platformProductOrderChatRoomIncludeWithLastMessage,
      },
    );
  }

  createChatRoom(createRoomDto: CreateChatRoomDto, user: IUserJwtPayload) {
    const { productOrderChatRoomMember, productOrderId, isGroupRoom } =
      createRoomDto;

    if (isGroupRoom && productOrderChatRoomMember === undefined)
      throw new BadRequestException(
        'Group room must have productOrderChatRoomMember!',
      );

    if (!isGroupRoom && productOrderChatRoomMember !== undefined)
      throw new BadRequestException(
        'Private room must not have productOrderChatRoomMember!',
      );

    const membersMap = [
      {
        userId: productOrderChatRoomMember,
      },
      { userId: user.id },
    ];

    return this.prismaService.platformProductOrderChatRoom.create({
      data: {
        productOrder: { connect: { id: productOrderId } },
        isGroupRoom,
        productOrderChatRoomMembers: {
          createMany: { data: membersMap },
        },
      },
      include: {
        productOrderChatRoomMembers: true,
        productOrder: true,
      },
    });
  }

  findChatRoomsByUserId(id: number, user: IUserJwtPayload) {
    return this.prismaService.platformProductOrderChatRoom.findMany({
      where: {
        productOrderChatRoomMembers: {
          some: {
            userId: user.id,
            productOrderChatRoom: {
              productOrder: {
                id,
              },
            },
          },
        },
      },
      include: this.platformProductOrderChatRoomIncludeWithLastMessage,
    });
  }

  async markMessagesAsReadByUser(messageIds: number[], user: IUserJwtPayload) {
    try {
      const messagesThatAreUnread =
        await this.prismaService.messageRead.findMany({
          where: {
            messageId: {
              in: messageIds,
            },
            userId: user.id,
            isRead: false,
          },
        });

      if (messagesThatAreUnread.length > 0) {
        const unreadMessageIds = messagesThatAreUnread.map(
          (unreadMessage) => unreadMessage.id,
        );

        const updatedUserMessagesRead =
          await this.prismaService.messageRead.updateMany({
            where: {
              id: {
                in: unreadMessageIds,
              },
              userId: user.id,
            },
            data: {
              isRead: true,
            },
          });

        return updatedUserMessagesRead;
      } else {
        console.log('No unread messages found.');
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  findChatMessagesByChatRoomId(
    chatRoomId: number,
    page: number,
    user: IUserJwtPayload,
  ) {
    //gets 50 by 50 messages
    return this.prismaService.platformProductOrderChatMessage.findMany({
      where: {
        chatRoomId,
        chatRoom: {
          // only consider chat rooms that the user is member of
          productOrderChatRoomMembers: { some: { userId: user.id } },
        },
      },
      include: {
        author: {
          include: {
            influencer: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: page * this.messageTake,
      take: this.messageTake,
    });
  }

  findMembersByChatRoomId(chatRoomId: number, user: IUserJwtPayload) {
    return this.prismaService.productOrderChatRoomMember.findMany({
      where: {
        productOrderChatRoomId: chatRoomId,
        userId: { not: user.id },
      },
      include: {
        user: {
          include: {
            influencer: true,
          },
        },
      },
    });
  }
}
