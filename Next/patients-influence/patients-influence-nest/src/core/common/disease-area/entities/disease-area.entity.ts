import { DiseaseArea } from '@prisma/client';
import { Transform } from 'class-transformer';

export class DiseaseAreaEntity implements DiseaseArea {
  id: number;
  name: string;
  identifier: string;
  isCommon: boolean;
  parentDiseaseAreaId: number;
  createdAt: Date;
  updatedAt: Date;

  @Transform(({ value }) =>
    value.map((item) => new ChildDiseaseAreaEntity(item)),
  )
  childDiseaseAreas?: ChildDiseaseAreaEntity[];
  @Transform(({ value }) =>
    value.map((item) => new ParentDiseaseAreaEntity(item)),
  )
  parentDiseaseAreas?: ParentDiseaseAreaEntity[];

  constructor({
    childDiseaseAreas,
    parentDiseaseAreas,
    ...data
  }: Partial<DiseaseAreaEntity>) {
    Object.assign(this, data);

    if (childDiseaseAreas) this.childDiseaseAreas = childDiseaseAreas;
    if (parentDiseaseAreas) this.parentDiseaseAreas = parentDiseaseAreas;
  }
}

export class ChildDiseaseAreaEntity extends DiseaseAreaEntity {}
export class ParentDiseaseAreaEntity extends DiseaseAreaEntity {}
