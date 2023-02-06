import { db } from '../../utils/db.server';

export type RegisterUser = {
  name: string;
  surname: string;
  address: string;
  email: string;
  password: string;
  isOrganizer: boolean;
  firebaseId: string;
};

export const registerUser = async ({
  address,
  email,
  isOrganizer,
  name,
  password,
  surname,
  firebaseId,
}: RegisterUser) => {
  return db.user.create({
    data: {
      email,
      password,
      isOrganizer,
      name,
      surname,
      address,
      firebaseId,
    },
  });
};

export type GetUserByFirebaseIdArgs = {
  firebaseId: string;
};

export const getUserByFirebaseId = async ({
  firebaseId,
}: GetUserByFirebaseIdArgs) => {
  return db.user.findFirst({
    where: {
      firebaseId,
    },
  });
};

export type GetUserByUserIdArgs = {
  userId: string;
};
export const getUserByUserId = async ({ userId }: GetUserByUserIdArgs) => {
  return db.user.findFirst({
    where: {
      id: userId,
    },
  });
};
