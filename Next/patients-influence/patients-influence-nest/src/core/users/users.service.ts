import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../integrations/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';
import { UserNotFoundException } from './exceptions/user.exception';
import { ContactAdminsDto } from './dto/contact-admins.dto';
import { UserEntity } from './entities/user.entity';
import { UserRole, UserStatus } from 'src/utils';
import { MailService } from 'src/integrations/mail/mail.service';
import { SendgridSender } from 'src/integrations/mail/enums/sender.enum';
import { UpdateUsersStatusDto } from './dto/update-users-status.dto';
import { SocialPlatform } from '../stakeholders/enums/social-platform.enum';
import { DeleteManyUsersDto } from './dto/delete-many-users.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly notificationService: NotificationsService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll({
    skip,
    take,
    sortBy,
    search,
  }: FilterParamsDto): Promise<PaginationResult<User>> {
    const queryWhere: Prisma.UserWhereInput = {
      OR: [
        {
          firstName: {
            contains: search ? search : '',
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: search ? search : '',
            mode: 'insensitive',
          },
        },
      ],
      role: {
        in: [UserRole.Client, UserRole.Ambassador, UserRole.Influencer],
      },
    };

    const queryOrderBy: Prisma.Enumerable<Prisma.UserOrderByWithRelationInput> =
      (sortBy as any) || { firstName: 'asc' };

    try {
      const result = await filterRecordsFactory(
        this.prismaService,
        (tx) => tx.user,
        {
          where: queryWhere,
          orderBy: queryOrderBy,
          skip,
          take,
        },
      )();

      if (result.result.length) {
        return result;
      } else {
        const queryOther: Prisma.UserWhereInput = {
          OR: [
            {
              firstName: {
                contains: search ? search : '',
                mode: 'insensitive',
              },
            },
            {
              lastName: { contains: search ? search : '', mode: 'insensitive' },
            },
          ],
        };
        const otherResult = await filterRecordsFactory(
          this.prismaService,
          (tx) => tx.user,
          {
            where: queryOther,
            orderBy: queryOrderBy,
            skip,
            take,
          },
        )();

        return otherResult;
      }
    } catch (error) {
      throw error;
    }

    // const users = await this.prismaService.user.findMany({
    //   // where: {
    //   //   OR: [
    //   //     {
    //   //       firstName: {
    //   //         contains: search,
    //   //         mode: 'insensitive',
    //   //       },
    //   //     },
    //   //     {
    //   //       lastName: {
    //   //         contains: search,
    //   //         mode: 'insensitive',
    //   //       },
    //   //     },
    //   //   ],
    //   // role: {
    //   //   in: [UserRole.Client, UserRole.Ambassador, UserRole.Influencer],
    //   // },
    //   // },
    // });

    // return users;

    // return users?.map((user) => {
    //   return {
    //     ...user,
    //     role: this.handleRole(user.role),
    //   };
    // });
  }

  async findOneById(
    id: number,
    throwError = false,
    queryInclude?: Prisma.UserInclude,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: queryInclude,
    });

    const { password, ...userWithoutPassword } = user;

    if (throwError && !user) {
      throw new UserNotFoundException({ id });
    }

    return userWithoutPassword;
  }

  async findOne(
    { ...properties }: Partial<User>,
    throwError = false,
    queryInclude?: Prisma.UserInclude,
  ) {
    const user = await this.prismaService.user.findFirst({
      where: { ...properties },
      include: queryInclude,
    });
    /* const user = await this.prismaService.user.findUnique({
      where: { ...properties },
      include: queryInclude,
    }); */

    if (throwError && !user) {
      throw new UserNotFoundException({
        id: properties.id,
        email: properties.email,
      });
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
        influencer: {
          update: {
            verifiedSince:
              updateUserDto.status === UserStatus.Approved ? new Date() : null,
          },
        },
      },
    });

    if (
      user &&
      user.status === UserStatus.Approved &&
      user.role === UserRole.Influencer &&
      updateUserDto.password === undefined
    ) {
      await this.notificationService.influencerApproved(user.id);
      const emailContent =
        "Congratulations on your approval! You are now part of our influencer network. We're excited to see the incredible content you'll create.";

      await this.mailService.sendNotificationToInfluencer(
        user.email,
        user.firstName,
        emailContent,
      );
    }

    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async deleteOne(id: number) {
    try {
      const user = await this.prismaService.user.update({
        where: { id },
        data: { isDeleted: true },
      });

      const deletedUserId = user.id;

      await this.prismaService.influencer.updateMany({
        where: {
          invitendByUserId: {
            in: deletedUserId,
          },
        },
        data: {
          invitendByUserId: null,
        },
      });

      return user;
    } catch (error) {
      // * can throw PrismaClientKnownRequestError P2025
      throw error;
    }
  }

  async deleteMany(dto: DeleteManyUsersDto) {
    const { userIds } = dto;
    try {
      const existingUsers = await this.prismaService.user.findMany({
        where: {
          id: { in: userIds },
        },
        select: {
          id: true,
        },
      });

      const existingUserIds = existingUsers.map((user) => user.id);
      const missingUserIds = userIds.filter(
        (userId) => !existingUserIds.includes(userId),
      );

      if (missingUserIds.length > 0) {
        throw new NotFoundException(
          `Users with IDs ${missingUserIds.join(', ')} not found.`,
        );
      }

      const updatedUsers = await this.prismaService.user.updateMany({
        where: {
          id: {
            in: userIds,
          },
        },
        data: {
          isDeleted: true,
        },
      });

      await this.prismaService.influencer.updateMany({
        where: {
          invitendByUserId: {
            in: userIds,
          },
        },
        data: {
          invitendByUserId: null,
        },
      });

      return updatedUsers;
    } catch (error) {
      throw error;
    }
  }

  async contactAdmins(dto: ContactAdminsDto, user: UserEntity) {
    const userRole = user.role;

    const subject = `${dto.topic ? '[' + dto.topic + '] ' : ''}${
      dto.subject
    } - ${user.firstName} ${user.lastName}`;
    let message = '';

    if (dto.topic) message += `<strong>TOPIC:</strong> ${dto.topic}<br><br>`;

    message +=
      `<strong>First name:</strong> ${user.firstName}<br/>` +
      `<strong>Last name:</strong> ${user.lastName}<br/>`;
    // `<strong>Role:</strong> ${ //* obsolete
    //   userRole === UserRole.Client
    //     ? 'CLIENT'
    //     : user.role === UserRole.Ambassador
    //     ? 'AMBASSADOR'
    //     : user.role === UserRole.Influencer
    //     ? 'INFLUENCER'
    //     : '-'
    // }<br/>`;

    if (userRole === UserRole.Influencer) {
      const userInfluencer = await this.prismaService.user.findFirst({
        where: { id: user.id },
        include: {
          influencer: {
            include: {
              stakeholders: true,
            },
          },
        },
      });

      if (
        userInfluencer.influencer.stakeholders.length &&
        userInfluencer.influencer.stakeholders[0].type ===
          SocialPlatform.Instagram
      ) {
        message +=
          `<br /><strong>Social Platform</strong>: Instagram <br />` +
          `<strong>Username</strong>: ${userInfluencer.influencer.stakeholders[0].socialPlatformUsername}<br />`;
      }
    }

    message += `<br /><strong>Message</strong>: ${dto.message} <br />`;

    let recipientEmail;
    if (userRole === UserRole.Client) {
      recipientEmail = SendgridSender.Client;
    } else if (userRole === UserRole.Ambassador) {
      recipientEmail = SendgridSender.Ambassador;
    } else if (userRole === UserRole.Influencer) {
      recipientEmail = SendgridSender.Influencer;
    } else {
      throw new BadRequestException('User role not found!');
    }

    await this.mailService.contactAdmins(
      recipientEmail,
      user.email,
      subject,
      message,
    );
  }

  async updateUsersStatus(updateDto: UpdateUsersStatusDto): Promise<void> {
    const { status, userIds } = updateDto;

    const existingUsers = await this.prismaService.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
      },
    });

    const existingUserIds = existingUsers.map((user) => user.id);
    const missingUserIds = userIds.filter(
      (userId) => !existingUserIds.includes(userId),
    );

    if (missingUserIds.length > 0) {
      throw new NotFoundException(
        `Users with IDs ${missingUserIds.join(', ')} not found.`,
      );
    }

    // await this.prismaService.user.updateMany({
    //   where: {
    //     id: { in: userIds },
    //   },
    //   data: {
    //     status,
    //     influencer: {
    //       update: {
    //         verifiedSince: status === UserStatus.Approved ? new Date() : null,
    //       },
    //     },
    //   },
    // });

    for (const userId of userIds) {
      const user = await this.prismaService.user.update({
        where: { id: userId },
        data: {
          status,
          influencer: {
            update: {
              verifiedSince: status === UserStatus.Approved ? new Date() : null,
            },
          },
        },
      });
    }

    const updatedUsers = await this.prismaService.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        status: true,
        firstName: true,
        email: true,
      },
    });

    if (updatedUsers.length) {
      updatedUsers.forEach(async (updatedUser) => {
        if (updatedUser.status === UserStatus.Approved) {
          await this.notificationService.influencerApproved(updatedUser.id);
          const subject = "You're Approved! Welcome to our Influencer Network";
          let emailContent = `<p><strong>Dear ${updatedUser.firstName}</strong>,</p>`;
          emailContent +=
            "<br /><p>Congratulations on your approval! <br /><br /> You are now part of our influencer network. We're excited to see the incredible content you'll create.<p>";
          // this.mailService.sendInfluencerApprovalCongrats(
          //   updatedUser.email,
          //   updatedUser.firstName,
          //   subject,
          //   emailContent,
          // );
          await this.mailService.sendEmptyInfluencer(
            updatedUser.email,
            updatedUser.firstName,
            emailContent,
          );
        }
      });
    }
  }

  // async getAffiliateLink(id: number) {
  //   try {
  //     const user = await this.prismaService.user.findFirst({
  //       where: {
  //         id,
  //       },
  //       include: {
  //         ambassador: true,
  //         influencer: true,
  //       },
  //     });

  //     const baseUrl = `${this._securityConfig.protocol}://${[
  //       this._securityConfig.appSubdomain,
  //       this._securityConfig.baseDomain,
  //     ]
  //       .filter((s) => !!s)
  //       .join('.')}`;

  //     const affiliateLink = generateAffiliateLink(baseUrl, user);

  //     return { affiliateLink };
  //   } catch (err) {
  //     throw err;
  //   }
  // }
}
