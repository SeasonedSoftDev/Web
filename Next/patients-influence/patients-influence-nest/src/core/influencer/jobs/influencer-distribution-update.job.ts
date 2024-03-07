import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { JobService } from 'src/utils/classes/job-service';
import { StakeholderType } from 'src/utils/enums/stakeholder-type.enum';
import { UserStatus } from 'src/utils';
import { mean, standardDeviation } from 'simple-statistics';
import { IDistributionRange } from '../interfaces/distribution-range.interface';
import { addDays } from 'date-fns';
import { ApplicationException } from 'src/exceptions/application.exception';
import { SurveyType } from 'src/core/surveys/enums/survey-type.enum';
import { PostType } from '../subroutes/desired-income/campaign/enums/post-type.enum';

@Injectable()
export class InfluencerDistributionUpdateService extends JobService {
  constructor(private readonly prismaService: PrismaService) {
    super(new Logger(InfluencerDistributionUpdateService.name));
  }

  private updateInfluencerFollowersDistribution = async () => {
    //#region skip if data is still relevant
    const maxDaysOld = 1;
    const lastUpdatedFollowerDistribution =
      await this.prismaService.influencerFollowersDistribution.findFirst({
        where: {
          createdAt: { gte: addDays(new Date(), -maxDaysOld) },
        },
        /* orderBy: {
          createdAt: 'desc',
        }, */
      });

    if (lastUpdatedFollowerDistribution) {
      throw new ApplicationException(
        `Influencer followers distribution data is not older than ${maxDaysOld} days: skipping`,
      );
    }
    //#endregion

    // ! number of non-muggle followers from each influencer on the platform
    // ? influencersFollowersCount
    const influencersNonMuggleFollowersCountResult =
      await this.prismaService.influencerFollower.groupBy({
        by: ['influencerId'],
        _count: { stakeholderId: true },
        where: {
          stakeholder: {
            type: { not: StakeholderType.NonMedical },
          },
          influencer: {
            user: {
              status: UserStatus.Approved,
            },
          },
        },
      });

    if (influencersNonMuggleFollowersCountResult.length === 0) {
      throw new ApplicationException(`Followers list is empty`);
    }

    //#region extract statistic data
    const influencersNonMuggleFollowersCount =
      influencersNonMuggleFollowersCountResult.map(
        (followers) => followers._count.stakeholderId,
      );
    const influencersNonMuggleFollowersCountMean = mean(
      influencersNonMuggleFollowersCount,
    );
    const influencersNonMuggleFollowersCountDeviation = standardDeviation(
      influencersNonMuggleFollowersCount,
    );
    const minus3Sigma =
      influencersNonMuggleFollowersCountMean -
      3 * influencersNonMuggleFollowersCountDeviation;
    const plus3Sigma =
      influencersNonMuggleFollowersCountMean +
      3 * influencersNonMuggleFollowersCountDeviation;
    //#endregion

    const rangeSpan = influencersNonMuggleFollowersCountDeviation / 2;
    const lowerBound = minus3Sigma + rangeSpan;
    const upperBound = plus3Sigma - rangeSpan;
    const ranges: IDistributionRange[] = [];

    // first range
    let influencersInRange = influencersNonMuggleFollowersCountResult.filter(
      (influencer) => influencer._count.stakeholderId < lowerBound,
    );
    ranges.push({
      count: influencersInRange.length,
      influencers: influencersInRange.map(
        (influencerInRange) => influencerInRange.influencerId,
      ),
      to: lowerBound,
    });

    // ranges between first and last range
    for (let i = lowerBound; i < upperBound; i += rangeSpan) {
      influencersInRange = influencersNonMuggleFollowersCountResult.filter(
        (influencer) =>
          influencer._count.stakeholderId >= i &&
          influencer._count.stakeholderId < i + rangeSpan,
      );

      ranges.push({
        count: influencersInRange.length,
        influencers: influencersInRange.map(
          (influencerInRange) => influencerInRange.influencerId,
        ),
        from: i,
        to: i + rangeSpan,
      });
    }

    // last range
    influencersInRange = influencersNonMuggleFollowersCountResult.filter(
      (influencer) => influencer._count.stakeholderId >= upperBound,
    );
    ranges.push({
      count: influencersInRange.length,
      influencers: influencersInRange.map(
        (influencerInRange) => influencerInRange.influencerId,
      ),
      from: upperBound,
    });

    // save data to a database
    await this.prismaService.$transaction(async (tx) => {
      const distributionRanges =
        await tx.influencerFollowersDistribution.create({
          data: {
            mean: influencersNonMuggleFollowersCountMean,
            standardDeviation: influencersNonMuggleFollowersCountDeviation,
            ranges: {
              createMany: {
                data: ranges.map((range) => ({
                  from: range.from,
                  to: range.to,
                  count: range.count,
                })),
              },
            },
          },
          select: {
            ranges: true,
          },
        });
      // connect returned range IDs with in-app memory ranges (these ranges have influencers property in it, DB doesn't have it yet)
      const mappedDistributionRanges = distributionRanges.ranges.map(
        (distributionRange) => {
          const range = ranges.find(
            (range) => range.from === distributionRange.from.toNumber(),
          );
          const { influencers, ...rest } = range;

          return {
            ...distributionRange,
            influencers,
          };
        },
      );
      // add a list of influencers in each its related range
      // ! pruning this data is legit after it's used successfuly in further distributions
      await Promise.all(
        mappedDistributionRanges.map(async (distributionRange) => {
          await tx.influencerFollowersDistributionInfluencer.createMany({
            data: distributionRange.influencers.map(
              (distributionRangeInfluencerId) => ({
                influencerFollowersDistributionRangeId: distributionRange.id,
                influencerId: distributionRangeInfluencerId,
              }),
            ),
          });
        }),
      );
    });

    this.logger.log(
      `Influencer followers stats:` +
        `\n\tmean=${influencersNonMuggleFollowersCountMean}` +
        `\n\tstandard_deviation=${influencersNonMuggleFollowersCountDeviation}` +
        `\n\tminus_3_sigma=${minus3Sigma}` +
        `\n\tplus_3_sigma=${plus3Sigma}` +
        `\n\tranges=${ranges.map((range): IDistributionRange => {
          return {
            count: range.count,
            from: range.from,
            to: range.to,
          };
        })}`,
    );
  };

  private updateInfluencerSurveyDesiredAmountDistribution = async () => {
    //#region skip if data is still relevant
    const maxDaysOld = 1;
    const lastUpdatedDesiredAmountDistribution =
      await this.prismaService.influencerSurveyDesiredAmountDistribution.findFirst(
        {
          where: {
            createdAt: { gte: addDays(new Date(), -maxDaysOld) },
          },
          // * no need to order by if we're interested if there was any recent update at all
          /* orderBy: {
            createdAt: 'desc',
          }, */
        },
      );

    if (lastUpdatedDesiredAmountDistribution) {
      throw new ApplicationException(
        `Influencer survey desired amount distribution data is not older than ${maxDaysOld} days: skipping`,
      );
    }
    //#endregion

    const surveyTypes = Object.values(SurveyType);

    await Promise.allSettled(
      surveyTypes.map(async (surveyType) => {
        const influencersSurveyDesiredAmountsResult =
          await this.prismaService.influencerSurveyAmount.findMany({
            distinct: ['influencerId'],
            // * take most recent
            orderBy: {
              createdAt: 'desc',
            },
            where: {
              surveyType: surveyType as number,
              desiredAmount: { not: null },
            },
          });

        if (influencersSurveyDesiredAmountsResult.length === 0) {
          throw new ApplicationException(`Survey desired amount list is empty`);
        }

        //#region extract statistic data
        const influencersSurveyDesiredAmounts =
          influencersSurveyDesiredAmountsResult.map((desiredAmountSetting) =>
            desiredAmountSetting.desiredAmount.toNumber(),
          );
        const influencersSurveyDesiredAmountsMean = mean(
          influencersSurveyDesiredAmounts,
        );
        const influencersSurveyDesiredAmountsDeviation = standardDeviation(
          influencersSurveyDesiredAmounts,
        );
        const minus3Sigma =
          influencersSurveyDesiredAmountsMean -
          3 * influencersSurveyDesiredAmountsDeviation;
        const plus3Sigma =
          influencersSurveyDesiredAmountsMean +
          3 * influencersSurveyDesiredAmountsDeviation;
        //#endregion

        const rangeSpan = influencersSurveyDesiredAmountsDeviation / 2;
        const lowerBound = minus3Sigma + rangeSpan;
        const upperBound = plus3Sigma - rangeSpan;
        const ranges: IDistributionRange[] = [];

        // first range
        let influencersInRange = influencersSurveyDesiredAmountsResult.filter(
          (desiredAmountSetting) =>
            desiredAmountSetting.desiredAmount.toNumber() < lowerBound,
        );
        ranges.push({
          count: influencersInRange.length,
          influencers: influencersInRange.map(
            (influencerInRange) => influencerInRange.influencerId,
          ),
          to: lowerBound,
        });

        // ranges between first and last range
        for (let i = lowerBound; i < upperBound; i += rangeSpan) {
          influencersInRange = influencersSurveyDesiredAmountsResult.filter(
            (desiredAmountSetting) =>
              desiredAmountSetting.desiredAmount.toNumber() >= i &&
              desiredAmountSetting.desiredAmount.toNumber() < i + rangeSpan,
          );

          ranges.push({
            count: influencersInRange.length,
            influencers: influencersInRange.map(
              (influencerInRange) => influencerInRange.influencerId,
            ),
            from: i,
            to: i + rangeSpan,
          });
        }

        // last range
        influencersInRange = influencersSurveyDesiredAmountsResult.filter(
          (desiredAmountSetting) =>
            desiredAmountSetting.desiredAmount.toNumber() >= upperBound,
        );
        ranges.push({
          count: influencersInRange.length,
          influencers: influencersInRange.map(
            (influencerInRange) => influencerInRange.influencerId,
          ),
          from: upperBound,
        });

        // save data to a database
        await this.prismaService.influencerSurveyDesiredAmountDistribution.create(
          {
            data: {
              mean: influencersSurveyDesiredAmountsMean,
              standardDeviation: influencersSurveyDesiredAmountsDeviation,
              surveyType: surveyType as number,
              ranges: {
                createMany: {
                  data: ranges.map((range) => ({
                    from: range.from,
                    to: range.to,
                    count: range.count,
                  })),
                },
              },
            },
          },
        );

        this.logger.log(
          `Influencer survey (${surveyType}) desired amount stats:` +
            `\n\tmean=${influencersSurveyDesiredAmountsMean}` +
            `\n\tstandard_deviation=${influencersSurveyDesiredAmountsDeviation}` +
            `\n\tminus_3_sigma=${minus3Sigma}` +
            `\n\tplus_3_sigma=${plus3Sigma}` +
            `\n\tranges=${ranges.map((range): IDistributionRange => {
              return {
                count: range.count,
                from: range.from,
                to: range.to,
              };
            })}`,
        );
      }),
    );
  };

  private updateInfluencerCampaignDesiredAmountDistribution = async () => {
    //#region skip if data is still relevant
    const maxDaysOld = 1;
    const lastUpdatedDesiredAmountDistribution =
      await this.prismaService.influencerCampaignDesiredAmountDistribution.findFirst(
        {
          where: {
            createdAt: { gte: addDays(new Date(), -maxDaysOld) },
          },
          // * no need to order by if we're interested if there was any recent update at all
          /* orderBy: {
            createdAt: 'desc',
          }, */
        },
      );

    if (lastUpdatedDesiredAmountDistribution) {
      throw new ApplicationException(
        `Influencer campaign desired amount distribution data is not older than ${maxDaysOld} days: skipping`,
      );
    }
    //#endregion

    const influencerFollowersDistribution =
      await this.prismaService.influencerFollowersDistribution.findFirst({
        where: {
          createdAt: { gte: addDays(new Date(), -maxDaysOld) },
        },
        // * take most recent
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          ranges: {
            include: {
              influencers: true,
            },
          },
        },
      });

    // check if influencer followers distribution is present and if not, run a job to update a data
    // after prerequisite, run this function again (job within job) and abort a current job
    if (!influencerFollowersDistribution) {
      // This sometimes has an infinite loop
      // await this.updateInfluencerFollowersDistributionJob();
      await this.updateInfluencerCampaignDesiredAmountDistribution();
      return;
    }

    const postTypes = Object.values(PostType);

    await Promise.all(
      postTypes.map((postType) => {
        influencerFollowersDistribution.ranges.map(async (range) => {
          const influencersCampaignDesiredAmountsResult =
            await this.prismaService.influencerCampaignAmount.findMany({
              distinct: ['influencerId'],
              // * take most recent
              orderBy: {
                createdAt: 'desc',
              },
              where: {
                postType: postType as number,
                desiredAmount: { not: null },
                influencerId: {
                  in: range.influencers.map(
                    (influencer) => influencer.influencerId,
                  ),
                },
              },
            });

          if (influencersCampaignDesiredAmountsResult.length === 0) {
            throw new ApplicationException(
              `Campaign desired amount list is empty`,
            );
          }

          //#region extract statistic data
          const influencersCampaignDesiredAmounts =
            influencersCampaignDesiredAmountsResult.map(
              (desiredAmountSetting) =>
                desiredAmountSetting.desiredAmount.toNumber(),
            );
          const influencersCampaignDesiredAmountsMean = mean(
            influencersCampaignDesiredAmounts,
          );
          const influencersCampaignDesiredAmountsDeviation = standardDeviation(
            influencersCampaignDesiredAmounts,
          );
          const minus3Sigma =
            influencersCampaignDesiredAmountsMean -
            3 * influencersCampaignDesiredAmountsDeviation;
          const plus3Sigma =
            influencersCampaignDesiredAmountsMean +
            3 * influencersCampaignDesiredAmountsDeviation;
          //#endregion

          const rangeSpan = influencersCampaignDesiredAmountsDeviation / 2;
          const lowerBound = minus3Sigma + rangeSpan;
          const upperBound = plus3Sigma - rangeSpan;
          const ranges: IDistributionRange[] = [];

          // first range
          let influencersInRange =
            influencersCampaignDesiredAmountsResult.filter(
              (desiredAmountSetting) =>
                desiredAmountSetting.desiredAmount.toNumber() < lowerBound,
            );
          ranges.push({
            count: influencersInRange.length,
            influencers: influencersInRange.map(
              (influencerInRange) => influencerInRange.influencerId,
            ),
            to: lowerBound,
          });

          // ranges between first and last range
          for (let i = lowerBound; i < upperBound; i += rangeSpan) {
            influencersInRange = influencersCampaignDesiredAmountsResult.filter(
              (desiredAmountSetting) =>
                desiredAmountSetting.desiredAmount.toNumber() >= i &&
                desiredAmountSetting.desiredAmount.toNumber() < i + rangeSpan,
            );

            ranges.push({
              count: influencersInRange.length,
              influencers: influencersInRange.map(
                (influencerInRange) => influencerInRange.influencerId,
              ),
              from: i,
              to: i + rangeSpan,
            });
          }

          // last range
          influencersInRange = influencersCampaignDesiredAmountsResult.filter(
            (desiredAmountSetting) =>
              desiredAmountSetting.desiredAmount.toNumber() >= upperBound,
          );
          ranges.push({
            count: influencersInRange.length,
            influencers: influencersInRange.map(
              (influencerInRange) => influencerInRange.influencerId,
            ),
            from: upperBound,
          });

          // save data to a database
          await this.prismaService.influencerCampaignDesiredAmountDistribution.create(
            {
              data: {
                mean: influencersCampaignDesiredAmountsMean,
                standardDeviation: influencersCampaignDesiredAmountsDeviation,
                influencerFollowersDistributionRangeId: range.id,
                postType: postType as number,
                ranges: {
                  createMany: {
                    data: ranges.map((range) => ({
                      from: range.from,
                      to: range.to,
                      count: range.count,
                    })),
                  },
                },
              },
            },
          );

          // * prune influencers list from followers distribution as it is not needed anymore
          await this.prismaService.influencerFollowersDistributionInfluencer.deleteMany(
            {
              where: {
                influencerFollowersDistributionRangeId: range.id,
              },
            },
          );

          this.logger.log(
            `Influencer campaign (${postType}) desired amount stats:` +
              `\n\tmean=${influencersCampaignDesiredAmountsMean}` +
              `\n\tstandard_deviation=${influencersCampaignDesiredAmountsDeviation}` +
              `\n\tminus_3_sigma=${minus3Sigma}` +
              `\n\tplus_3_sigma=${plus3Sigma}` +
              `\n\tranges=${ranges.map((range): IDistributionRange => {
                return {
                  count: range.count,
                  from: range.from,
                  to: range.to,
                };
              })}`,
          );
        });
      }),
    );
  };

  // These cron jobs are causing infinite loops from time to time and need investigation, some other dev worked on these
  //   // * at 00:00 every day
  //   @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
  //     name: 'update-influencer-followers-distribution',
  //   })
  //   async updateInfluencerFollowersDistributionJob() {
  //     await this.jobWrapper(
  //       'update-influencer-followers-distribution',
  //       this.updateInfluencerFollowersDistribution,
  //     );
  //   }

  //   // * at 00:10 every day
  //   // reference: https://crontab.guru/#10_0_*_*_*
  //   @Cron('10 0 * * *', {
  //     name: 'update-influencer-survey-desired-amount-distribution',
  //   })
  //   async updateInfluencerSurveyDesiredAmountDistributionJob() {
  //     await this.jobWrapper(
  //       'update-influencer-survey-desired-amount-distribution',
  //       this.updateInfluencerSurveyDesiredAmountDistribution,
  //     );
  //   }

  //   // * at 00:10 every day
  //   // reference: https://crontab.guru/#10_0_*_*_*
  //   @Cron('10 0 * * *', {
  //     name: 'update-influencer-campaign-desired-amount-distribution',
  //   })
  //   async updateInfluencerCampaignDesiredAmountDistributionJob() {
  //     await this.jobWrapper(
  //       'update-influencer-campaign-desired-amount-distribution',
  //       this.updateInfluencerCampaignDesiredAmountDistribution,
  //     );
  //   }
}
