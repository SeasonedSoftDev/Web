import { array, object, string, date } from 'yup';

export const emailSchema = object().shape({
  email: string().email(),
});

export const passwordSchema = object().shape({
  password: string()
    .min(8)
    .matches(/[0-9]/)
    .matches(/[a-z]/)
    .matches(/[A-Z]/)
    .matches(/[^\w]/),
});

export const firstNameSchema = object().shape({
  firstName: string().min(2),
});

export const instagramUsernameSchema = string().min(3).max(30);

export const lastNameSchema = object().shape({
  lastName: string().min(2),
});

export const locationSchema = object().shape({
  location: object(),
});

export const genderSchema = object().shape({
  gender: object(),
});

export const experienceAsSchema = object().shape({
  experienceAs: object(),
});

export const diseaseAreaSchema = object().shape({
  diseaseArea: array(),
});

export const ethnicitySchema = object().shape({
  ethnicity: object(),
});

export const instagramPostSchema = object().shape({
  instaP: string(),
});

export const instagramStorySchema = object().shape({
  instaS: string(),
});

export const instagramReelSchema = object().shape({
  instaR: string(),
});

export const birthDateSchema = object().shape({
  birthDate: date(),
});

export const nameSchema = object().shape({
  length: string().min(2).max(15),
  pattern: string().matches(/^[a-zA-Z\s]+$/),
});

export const usernameSchema = object().shape({
  username: string()
    .min(6)
    .matches(/[a-z0-9.]/)
    .matches(/^\S*$/),
});
