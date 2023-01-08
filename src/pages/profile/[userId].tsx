import {
  Avatar,
  Box,
  Center,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { Tweet as ITweet, User } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Navbar } from "../../components/nav/Navbar";
import { Tweet } from "../../components/tweet/Tweet";
import { trpc } from "../../utils/trpc";

const UserProfile: NextPage = () => {
  const router = useRouter();

  const [tweets, setTweets] = React.useState<
    (ITweet & {
      author: User;
      likedBy: User[];
    })[]
  >([]);

  const { userId } = router.query;

  const { data: user, isLoading } = trpc.auth.getUser.useQuery({
    id: userId as string,
  });

  const { data: userTweets, isLoading: isUserLoading } =
    trpc.tweet.getUserTweets.useQuery({
      userId: userId as string,
    });

  if (isLoading || isUserLoading) {
    return (
      <Center pt="10">
        <Spinner />
      </Center>
    );
  }

  if (tweets.length === 0 && userTweets) {
    setTweets(userTweets);
  }

  return (
    <div>
      <Navbar />
      <Box p="20">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderWidth="1px"
          borderRadius="lg"
          borderColor="gray.600"
          p="6"
        >
          <VStack>
            <Box>
              <HStack spacing="50">
                <Box>
                  <Avatar src={user?.image as string} size="2xl" />
                </Box>
                <Box>
                  <Heading>{user?.name}</Heading>
                  <Text color="gray.400">{tweets.length} Tweets</Text>
                </Box>
              </HStack>
            </Box>
            <Box pt="10">
              {userTweets?.map((tweet) => (
                <Box key={tweet.id} pt="5">
                  <Tweet
                    tweet={tweet}
                    setTweets={setTweets}
                    likedBy={tweet.likedBy}
                    author={tweet.author}
                  />
                </Box>
              ))}
            </Box>
          </VStack>
        </Box>
      </Box>
    </div>
  );
};

export default UserProfile;
