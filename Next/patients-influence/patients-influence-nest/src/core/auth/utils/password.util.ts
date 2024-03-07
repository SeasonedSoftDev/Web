import * as bcrypt from 'bcrypt';
import { InvalidPasswordException } from '../exceptions/password.exception';

export async function hashPassword(password: string, saltRounds: number) {
  return await bcrypt.hash(password, saltRounds);
}

export async function passwordValid(
  password: string,
  hash: string,
  throwError = false,
  email: string,
) {
  const passValid = await bcrypt.compare(password, hash);

  if (throwError && !passValid) {
    throw new InvalidPasswordException({ email });
  }

  return passValid;
}
