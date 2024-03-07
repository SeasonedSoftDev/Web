import { TUserRole } from 'types/global';

export const convertNumberToRole = (roleId: number): TUserRole => {
  const roles: TUserRole[] = [
    'SUPERADMIN',
    'ADMIN',
    'AMBASSADOR',
    'CLIENT',
    'INFLUENCER',
  ];

  return roles[roleId];
};

export const ensureHttpsProtocol = (link: string): string => {
  if (link.includes('localhost') && !link.startsWith('https://')) {
    return `http://${link}`;
  }

  if (!link.startsWith('http://') && !link.startsWith('https://')) {
    return `https://${link}`;
  }
  return link;
};

export interface ISelectField {
  label: string;
  value: string;
}

export interface IMinMaxField {
  min: string;
  max: string;
}

export const handleFormatParamKey = (
  key: IMinMaxField | ISelectField | number | null,
  type: 'select' | 'min' | 'max' | 'number' = 'select'
): number | undefined => {
  let keyVal: number | undefined;

  if (type === 'select') {
    const keySelectVal = key as ISelectField;
    keyVal =
      keySelectVal && (+keySelectVal.value || +keySelectVal.value === 0)
        ? +keySelectVal.value
        : undefined;
  } else if (type === 'min') {
    const keyMinMaxVal = key as IMinMaxField;

    if (keyMinMaxVal.min.length === 0) {
      keyVal = undefined;
    } else {
      keyVal =
        keyMinMaxVal && (+keyMinMaxVal.min || +keyMinMaxVal.min === 0)
          ? +keyMinMaxVal.min
          : undefined;
    }
  } else if (type === 'max') {
    const keyMinMaxVal = key as IMinMaxField;
    if (keyMinMaxVal.max.length === 0) {
      keyVal = undefined;
    } else {
      keyVal =
        keyMinMaxVal && (+keyMinMaxVal.max || +keyMinMaxVal.max === 0)
          ? +keyMinMaxVal.max
          : undefined;
    }
  } else if (type === 'number') {
    if (key === null) {
      keyVal = undefined;
    } else {
      keyVal = key && (+key || +key === 0) ? (+key as number) : undefined;
    }
  } else {
    keyVal = undefined;
  }

  return keyVal;
};

export const getStateValueAsNumArray = (stateValue: ISelectField[]): number[] =>
  stateValue && stateValue.length ? stateValue.map((item) => +item.value) : [];
