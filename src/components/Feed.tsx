import { Box, Center, Spinner, VStack } from "@chakra-ui/react";
import type { Tweet as ITweet, User } from "@prisma/client";
import React from "react";
import { trpc } from "../utils/trpc";
import { NewTweet } from "./tweet/NewTweet";
import { Tweet } from "./tweet/Tweet";

export const Feed = () => {
  const [tweets, setTweets] = React.useState<
    (ITweet & {
      author: User;
      likedBy: User[];
    })[]
  >([]);

  const {
    data: tweetsData,
    isLoading,
    isFetching,
  } = trpc.tweet.getTweets.useQuery();

  if (isFetching && isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (tweets.length === 0 && tweetsData) {
    setTweets(tweetsData);
  }

  return (
    <div>
      <Box pt="10" pb="10">
        <Center>
          <NewTweet setTweets={setTweets} />
        </Center>
      </Box>
      <Box>
        <Center>
          <VStack>
            {tweetsData &&
              tweets.map((tweet) => (
                <Tweet
                  tweet={tweet}
                  key={tweet.id}
                  author={tweet.author}
                  setTweets={setTweets}
                  likedBy={tweet.likedBy}
                />
              ))}
          </VStack>
        </Center>
      </Box>
    </div>
  );
};
