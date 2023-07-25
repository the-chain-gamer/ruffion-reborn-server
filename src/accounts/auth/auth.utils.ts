import * as argon2 from 'argon2';

export async function isPasswordValid(password: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, password);
}

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}
