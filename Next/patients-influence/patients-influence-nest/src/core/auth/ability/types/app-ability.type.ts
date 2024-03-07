import { PureAbility } from '@casl/ability';
import { PrismaQuery } from '@casl/prisma';
import { AppSubjects } from './app-subjects.type';

export type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;
