import {
  Center,
  Spinner,
  VStack,
  HStack,
  Avatar,
  Heading,
  Box,
  Text,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import type { Tweet as ITweet, User } from "@prisma/client";
import type { Session } from "next-auth";
import React from "react";
import { trpc } from "../../utils/trpc";
import { Tweet } from "../tweet/Tweet";
import { BioModal } from "./BioModal";

interface ProfileProps {
  userId: string;
  session: Session;
}

export const Profile: React.FC<ProfileProps> = ({ userId, session }) => {
  const [tweets, setTweets] = React.useState<
    (ITweet & {
      author: User;
      likedBy: User[];
    })[]
  >([]);

  const { data: user, isLoading } = trpc.auth.getUser.useQuery({
    id: userId as string,
  });

  const { data: userTweets, isLoading: isUserLoading } =
    trpc.tweet.getUserTweets.useQuery({
      userId: userId as string,
    });

  const { isOpen, onClose, onOpen } = useDisclosure();

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
      <BioModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} />

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
                  {tweets.length === 1 ? (
                    <Text color="gray.400">1 Tweet</Text>
                  ) : (
                    <Text color="gray.400">{tweets.length} Tweets</Text>
                  )}
                </Box>
              </HStack>
              <Box pt="5">
                <Center>
                  {user?.bio === null && session?.user?.id === user?.id && (
                    <HStack>
                      <Text color="gray.400">
                        You haven&apos;t added a bio yet.
                      </Text>
                      <Button size="xs" colorScheme="twitter" onClick={onOpen}>
                        add bio
                      </Button>
                    </HStack>
                  )}

                  {user?.bio === null && session?.user?.id !== user?.id && (
                    <Text color="gray.400">
                      {user?.name} hasn&apos;t added a bio yet.
                    </Text>
                  )}

                  {user?.bio !== null && (
                    <HStack>
                      <Text color="gray.400">{user?.bio}</Text>
                      {user?.bio !== null && session?.user?.id === user?.id && (
                        <Button
                          size="xs"
                          colorScheme="twitter"
                          onClick={onOpen}
                        >
                          edit bio
                        </Button>
                      )}
                    </HStack>
                  )}
                </Center>
              </Box>
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
