export class Metadata {
  [property: string]: any;
}

export class MetadataArrayResult<TMetadata = object, TData = any> {
  metadata: Metadata & TMetadata;
  data: TData[];
}
