import React from "react";
import type { Tweet as ITweet } from "@prisma/client";

interface TweetProps {
  tweet: ITweet;
}

export const Tweet: React.FC<TweetProps> = ({ tweet }) => {
  return <div>{tweet.message}</div>;
};
