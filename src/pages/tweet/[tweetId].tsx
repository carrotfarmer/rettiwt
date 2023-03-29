import { Box, Center, Spinner, HStack, Avatar, Text, Heading, VStack } from "@chakra-ui/react";

import type { NextPage } from "next";
import { useRouter } from "next/router";

import React from "react";

import type { User } from "@prisma/client";
import type { Tweet as ITweet } from "@prisma/client";

import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";

import { Metadata } from "../../components/Metadata";
import { Navbar } from "../../components/nav/Navbar";
import { Tweet } from "../../components/tweet/Tweet";

const TweetPage: NextPage = () => {
  const router = useRouter();
  const { tweetId } = router.query;

  const { data: session } = useSession();

  const {
    data: tweetData,
    isFetching,
    isLoading,
  } = trpc.tweet.getTweet.useQuery({
    tweetId: tweetId as string,
  });

  const [_, setTweets] = React.useState<
    (ITweet & {
      author: User;
      likedBy: User[];
    })[]
  >([]);

  const [tweet, setTweet] = React.useState<
    ITweet & {
      author: User;
      likedBy: User[];
    }
  >();

  if (isFetching && isLoading) {
    return (
      <Center pt="10">
        <Spinner />
      </Center>
    );
  }

  if (!tweet && tweetData) {
    setTweet(tweetData);
  }

  return (
    <div>
      <Metadata title={`tweet by ${tweet?.author.name}`} description={tweet?.message as string} />
      <link rel="icon" href="/favicon-trans.png" />

      <Navbar />
      {session ? (
        <>
          <Center pt="5">
            <Tweet
              tweet={tweet as ITweet}
              author={tweet?.author as User}
              likedBy={tweet?.likedBy as User[]}
              setTweets={setTweets}
              key={tweet?.id}
              isRenderedOnPage={true}
            />
          </Center>
          <Center pt="5">
            <Heading fontSize="lg">liked by:</Heading>
          </Center>
          <Center pt="3">
            <VStack>
              {(tweet?.likedBy.length as number) > 0 ? (
                tweet?.likedBy.map((user) => (
                  <HStack key={user.id} pt="2">
                    <Avatar size="sm" src={user.image as string} />
                    <Text fontWeight="bold">{user.name}</Text>
                  </HStack>
                ))
              ) : (
                <b>
                  {(session?.user as User).id === tweet?.author.id
                    ? "NO ONE'S LIKED YOUR STUPID TWEET LMAO"
                    : "NO ONE'S LIKED THIS STUPID TWEET LMAO"}
                </b>
              )}
            </VStack>
          </Center>
        </>
      ) : (
        <Box>
          <Center>
            <Text>You have to sign in to view this page.</Text>
          </Center>
        </Box>
      )}
    </div>
  );
};

export default TweetPage;

