import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  PostContentToken,
  PostContentTokenOccurence,
  Prisma,
  StakeholderPost,
} from '@prisma/client';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { TokenType } from '../enums/token-type.type';
import { NLPService } from '../nlp.service';
import { ITokenMapValue } from '../interfaces/token-map-value.interface';
import { JobService } from 'src/utils/classes/job-service';

@Injectable()
export class StakeholderPostProcessorService extends JobService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly nlmService: NLPService,
  ) {
    super(new Logger(StakeholderPostProcessorService.name));
  }

  async countTokens(context: StakeholderPostProcessorService) {
    let posts: StakeholderPost[];
    let skip = 0;
    const take = 10;

    while (true) {
      //!refactor to while posts.length > 0
      posts = await context.prismaService.stakeholderPost.findMany({
        skip,
        take,
        where: { isContentProcessed: false },
      });

      if (posts.length > 0) {
        skip += take;

        for (const post of posts) {
          const postContentNormalized = context.nlmService.processText(
            post.content,
          );

          const tokensMap = postContentNormalized.strippedText
            // * it already is lowercase
            .match(/\b(\w+)\b/g)
            .reduce(function (map, token) {
              map.set(token, {
                type: TokenType.Word,
                count: (map.get(token)?.count || 0) + 1,
              });
              return map;
            }, new Map<string, ITokenMapValue>());
          postContentNormalized.emojis.reduce(function (map, token) {
            map.set(token, {
              type: TokenType.Emoji,
              count: (map.get(token)?.count || 0) + 1,
            });
            return map;
          }, tokensMap);
          postContentNormalized.hashtags.reduce(function (map, token) {
            map.set(token, {
              type: TokenType.Hashtag,
              count: (map.get(token)?.count || 0) + 1,
            });
            return map;
          }, tokensMap);
          postContentNormalized.mentions.reduce(function (map, token) {
            map.set(token, {
              type: TokenType.Mention,
              count: (map.get(token)?.count || 0) + 1,
            });
            return map;
          }, tokensMap);

          /* const tokenUpsertQueries: Prisma.PostContentTokenUpsertArgs[] = [];
          const postTokenUpsertQueries: Prisma.PostContentTokenOccurenceUpsertArgs[] = [];

          Array.from(tokensMap.entries()).forEach(([key, { type, count }]) => {
            tokenUpsertQueries.push({
              create: {
                token: key,
                tokenType: type,
                occurences: count,
              },
              update: {
                occurences: { increment: count },
                tokenOccurences
              },
              where: {
                token: key,
              },
            });
            postTokenUpsertQueries.push({
              create: {
                postId: post.id,
                tokenId: token.id,
                occurences: count,
              },
              update: {
                occurences: { increment: count },
              },
              where: {
                postId_tokenId: { postId: post.id, tokenId: token.id },
              },
            });
          }); */

          await Promise.all(
            Array.from(tokensMap.entries()).map(([key, { type, count }]) => {
              return context.prismaService.$transaction(async (tx) => {
                const token = await tx.postContentToken.upsert({
                  create: {
                    token: key,
                    tokenType: type,
                    occurences: count,
                  },
                  update: {
                    occurences: { increment: count },
                  },
                  where: {
                    token: key,
                  },
                });

                const postToken = await tx.postContentTokenOccurence.upsert({
                  create: {
                    postId: post.id,
                    tokenId: token.id,
                    occurences: count,
                  },
                  update: {
                    occurences: { increment: count },
                  },
                  where: {
                    PostTokenIdentifier: { postId: post.id, tokenId: token.id },
                  },
                });

                const result = await tx.stakeholderPost.update({
                  where: { id: post.id },
                  data: {
                    preprocessedContent: `${
                      postContentNormalized.strippedText
                    } ${postContentNormalized.emojis.join(
                      ' ',
                    )} ${postContentNormalized.hashtags.join(
                      ' ',
                    )} ${postContentNormalized.mentions.join(' ')}`,
                    isContentProcessed: true,
                  },
                });

                context.logger.log(`Post ${post.id} - content processed`);

                return result;
              });
            }),
          );
        }
      }
      if (posts.length < take) {
        break;
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'count-post-tokens' })
  async countTokensJob() {
    // await this.jobWrapper('count-post-tokens', this.countTokens);
  }
}
