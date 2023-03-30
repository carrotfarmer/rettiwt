import { PrismaClient } from "@prisma/client";
import type { ProfileMetadata } from "../types/ProfileMetadata";

export const getProfileMetadata = async (userId: string): Promise<ProfileMetadata> => {
  const prisma = new PrismaClient();

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      tweets: true
    }
  });

  return {
    title: `${user?.name} on rettiwtt`,
    description: `${user?.name} - ${user?.tweets.length} tweets`,
  };
};

