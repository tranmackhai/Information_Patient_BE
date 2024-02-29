import { User } from "@prisma/client";
import { prisma } from "../db";

const getUser = async (id: number): Promise<User | null> => {
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });
  return user;
};

export { getUser };
