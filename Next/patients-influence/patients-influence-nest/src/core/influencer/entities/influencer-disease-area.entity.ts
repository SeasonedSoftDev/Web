import { DiseaseArea, InfluencerDiseaseArea } from '@prisma/client';

export class InfluencerDiseaseAreaEntity implements InfluencerDiseaseArea {
  id: number;
  influencerId: number;
  diseaseAreaId: number;
  createdAt: Date;
  updatedAt: Date;
  diseaseAreas: DiseaseArea;

  constructor(partial: Partial<InfluencerDiseaseAreaEntity>) {
    Object.assign(this, partial);
  }
}
