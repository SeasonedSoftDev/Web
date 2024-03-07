import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ApplicationException } from 'src/exceptions/application.exception';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    this.enableUserHooks();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  enableUserHooks() {
    this.$use(async (params, next) => {
      if (params.model === 'User') {
        let userId: number;
        let status: number;

        // ! updateMany won't work properly as we don't know user IDs that were affected
        // ! => in that case, userId will 'probably' be undefined
        if (['create', 'update', 'updateMany'].includes(params.action)) {
          // happens on CREATE, UPDATE SINGLE user or bulk action UPDATE
          userId = params.args.where?.id;
          status = params.args.status;
        } else if (params.action === 'upsert') {
          // happens on bulk action UPDATE
          // ? will it ever be used
          // ? => creating/updating multiple users is potential problem
          userId = params.args.where.id;
          status = params.args.update.status;
        }

        if (status !== undefined) {
          // if CREATE or UPDATE, user is returned, else bulk action result
          // * => with high confidence we can conclude user object will be returned the most often
          // *    as we don't know IDs that were affected
          const user = await next(params);

          if (userId === undefined && user.id === undefined) {
            throw new ApplicationException(
              `Unknown user ID: ${JSON.stringify(params)}`,
            );
          }

          await this.userStatusChangelog.create({
            data: { userId: userId ?? user.id, status },
          });

          // * eg. user (create, update) or bulk action result (updateMany)
          // ? upsert - user or bulk action result
          return user;
        }
      }

      if (params.model === 'PlatformProductOrder') {
        let platformProductOrderId: number;
        let status: number;

        // ! updateMany won't work properly as we don't know user IDs that were affected
        // ! => in that case, platformProductOrderId will 'probably' be undefined
        if (['create', 'update', 'updateMany'].includes(params.action)) {
          // happens on CREATE, UPDATE SINGLE platform product order or bulk action UPDATE
          platformProductOrderId = params.args.where?.id;
          status = params.args.status;
        } else if (params.action === 'upsert') {
          // happens on bulk action UPDATE
          // ? will it ever be used
          // ? => creating/updating multiple platform product orders is potential problem
          platformProductOrderId = params.args.where.id;
          status = params.args.update.status;
        }

        if (status !== undefined) {
          // if CREATE or UPDATE, platform product order is returned, else bulk action result
          // * => with high confidence we can conclude platform product order object will be returned the most often
          // *    as we don't know IDs that were affected
          const platformProductOrder = await next(params);

          if (
            platformProductOrderId === undefined &&
            platformProductOrder.id === undefined
          ) {
            throw new ApplicationException(
              `Unknown platform product order ID: ${JSON.stringify(params)}`,
            );
          }

          await this.platformProductOrderStatusChangelog.create({
            data: {
              platformProductOrderId:
                platformProductOrderId ?? platformProductOrder.id,
              status,
            },
          });

          // * eg. platform product order (create, update) or bulk action result (updateMany)
          // ? upsert - platform product order or bulk action result
          return platformProductOrder;
        }
      }

      return await next(params);
    });
  }
}
