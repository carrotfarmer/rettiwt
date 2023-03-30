import { PrismaClient } from "@prisma/client";
import type { TweetMetadata } from "../types/TweetMetadata";

export const getTweetMetadata = async (tweetId: string): Promise<TweetMetadata> => {
  const prisma = new PrismaClient();

  const tweet = await prisma.tweet.findUnique({
    where: {
      id: tweetId,
    },
    include: {
      author: true,
      likedBy: true,
    },
  });

  return {
    title: `tweet by ${tweet?.author.name}`,
    description: tweet?.message as string,
  };
};

