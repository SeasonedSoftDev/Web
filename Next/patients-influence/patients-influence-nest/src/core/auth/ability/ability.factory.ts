import { AbilityBuilder, ExtractSubjectType } from '@casl/ability';
import { createPrismaAbility } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { UserRole } from '../../../utils/enums/user-role.enum';
import { AppSubjects } from './types/app-subjects.type';
import { Action } from './enums/action.enum';
import { AppAbility } from './types/app-ability.type';
import { UserEntity } from 'src/core/users/entities/user.entity';

@Injectable()
export class AbilityFactory {
  defineAbility(user: UserEntity) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    if (user.role === UserRole.SuperAdmin) {
      can(Action.Manage, 'all');
      cannot(Action.Delete, 'User', { id: user.id }).because(
        `As a super admin, you can't delete yourself`,
      );
    } else if (user.role === UserRole.Admin) {
      can(Action.Read, 'all');
      can(Action.Create, 'all');
      can(Action.Manage, 'all');
      can(Action.Update, 'User', { id: user.id });
      cannot(Action.Delete, 'User', { id: user.id }).because(
        `As an admin, you can't delete yourself`,
      );
    } else if (user.role === UserRole.Influencer) {
      cannot(Action.Manage, 'all').because(
        `As a influencer, you can't manage resources out of your scope, eg. influencer scope`,
      );
      can(Action.Read, 'Influencer', { userId: user.id });
      can(Action.Update, 'Influencer', { userId: user.id });
      can(Action.Delete, 'Influencer', { userId: user.id });

      can(Action.Create, 'Company');
      can(Action.Read, 'Company', {
        OR: [{ createdByUserId: user.client?.id }, { isApproved: true }],
      });
      // can(Action.Create, 'Location');
      can(Action.Read, 'Location');
      can(Action.Read, 'DiseaseArea');

      can(Action.Create, 'BenefitSuggestion');
      can(Action.Read, 'BenefitSuggestion');

      can(Action.Read, 'Campaign', {
        platformProductOrder: {
          platformProductOrderInfluencers: {
            some: { influencer: { userId: user.id } },
          },
        },
      });

      can(Action.Read, 'Survey', {
        platformProductOrder: {
          platformProductOrderInfluencers: {
            some: { influencer: { userId: user.id } },
          },
        },
      });
    } else if (user.role === UserRole.Client) {
      cannot(Action.Manage, 'all').because(
        `As a client, you can't manage resources out of your scope, eg. client scope`,
      );
      can(Action.Read, 'Client', { userId: user.id });
      can(Action.Update, 'Client', { userId: user.id });
      can(Action.Delete, 'Client', { userId: user.id });

      can(Action.Read, 'ClientDiseaseArea', { clientId: user.client.id });

      can(Action.Create, 'Company');
      can(Action.Read, 'Company', {
        OR: [{ createdByUserId: user.id }, { isApproved: true }],
      });
      can(Action.Create, 'Product');
      can(Action.Read, 'Product', { createdByClientId: user.client?.id });
      can(Action.Update, 'Product', { createdByClientId: user.client?.id });
      can(Action.Delete, 'Product', { createdByClientId: user.client?.id });

      can(Action.Manage, 'ClientProduct', { clientId: user.client?.id });

      // can(Action.Create, 'Location');
      can(Action.Read, 'Location');
      can(Action.Read, 'DiseaseArea');

      can(Action.Create, 'Campaign');
      can(Action.Read, 'Campaign', {
        platformProductOrder: { client: { userId: user.id } },
      });
      can(Action.Update, 'Campaign', {
        platformProductOrder: { client: { userId: user.id } },
      });

      can(Action.Create, 'CampaignReport', {
        campaign: { platformProductOrder: { client: { userId: user.id } } },
      });
      can(Action.Read, 'CampaignReport', {
        campaign: { platformProductOrder: { client: { userId: user.id } } },
      });

      can(Action.Create, 'Survey');
      can(Action.Read, 'Survey', {
        platformProductOrder: { client: { userId: user.id } },
      });
      can(Action.Update, 'Survey', {
        platformProductOrder: { client: { userId: user.id } },
      });

      can(Action.Create, 'SML');
      can(Action.Read, 'SML', {
        platformProductOrder: { client: { userId: user.id } },
      });
      can(Action.Update, 'SML', {
        platformProductOrder: { client: { userId: user.id } },
      });
    } else if (user.role === UserRole.Ambassador) {
      cannot(Action.Manage, 'all').because(
        `As an ambassador, you can't manage resources out of your scope, eg. ambassador scope`,
      );
      can(Action.Read, 'Ambassador', { userId: user.id });
      can(Action.Update, 'Ambassador', { userId: user.id });
      can(Action.Delete, 'Ambassador', { userId: user.id });

      can(Action.Read, 'Company', {
        OR: [{ createdByUserId: user.id }, { isApproved: true }],
      });
      // can(Action.Create, 'Location');
      can(Action.Read, 'Location');
      can(Action.Read, 'DiseaseArea');

      can(Action.Read, 'Campaign', {
        platformProductOrder: { client: { ambassador: { userId: user.id } } },
      });

      can(Action.Read, 'Survey', {
        platformProductOrder: { client: { ambassador: { userId: user.id } } },
      });
    } else {
      throw new Error(`Not implemented: UserRole[${user.role}]`);
    }

    return build({
      detectSubjectType: (item) =>
        // TODO review conversion to unknown and to ExtractSubjectType<AppSubjects>
        item.constructor as unknown as ExtractSubjectType<AppSubjects>,
    });
  }
}
