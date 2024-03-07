import { compare, hash, genSalt } from 'bcrypt';

export const Compare = async (password: string, hash: string) => {
  return await compare(password, hash);
};

export const Hash = async (password: string) => {
  const salt = await genSalt();
  return await hash(password, salt);
};
