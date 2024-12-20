import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = (password: string): string => {
  //getSalt() and hash() are asynchronous functions that return a Promise.
  //getSaltSync() and hashSync() are synchronous functions that return a string.
  const salt: string = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (plain: string, hashed: string): boolean => {
  return bcrypt.compareSync(plain, hashed);
};
