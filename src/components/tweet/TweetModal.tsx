import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  HStack,
  Avatar,
} from "@chakra-ui/react";
import React from "react";
import type { Tweet as ITweet, User as IUser } from "@prisma/client";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";

interface TweetModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  tweet: ITweet;
  likedBy: IUser[];
  setTweets: React.Dispatch<
    React.SetStateAction<
      (ITweet & {
        author: IUser;
        likedBy: IUser[];
      })[]
    >
  >;
}

export const TweetModal: React.FC<TweetModalProps> = ({
  isOpen,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClose,
  likedBy,
  setTweets,
  tweet,
}) => {
  const { mutate: likeTweet } = trpc.tweet.likeTweet.useMutation({
    onSuccess: (data) => {
      setTweets((prev) => {
        const index = prev.findIndex((t) => t.id === data.id);
        prev[index] = data;
        return [...prev];
      });
    },
  });

  const { mutate: dislikeTweet } = trpc.tweet.dislikeTweet.useMutation({
    onSuccess: (data) => {
      setTweets((prev) => {
        const index = prev.findIndex((t) => t.id === data.id);
        prev[index] = data;
        return [...prev];
      });
    },
  });

  const { data: session } = useSession();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tweet Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Liked By:</Text>
          {likedBy.length > 0 ? likedBy.map((user) => (
            <HStack key={user.id} pt="2">
              <Avatar size="sm" src={user.image as string} />
              <Text fontWeight="bold">{user.name}</Text>
            </HStack>
          )) : <b>NO ONE'S LIKED YOUR STUPID TWEET LMAO</b>}
        </ModalBody>

        <ModalFooter>
          {likedBy.find((user) => user.id === session?.user?.id) ? (
            <Button
              colorScheme="twitter"
              mr={3}
              onClick={() => {
                dislikeTweet({ tweetId: tweet.id });
                onClose();
              }}
            >
              Dislike
            </Button>
          ) : (
            <Button
              colorScheme="twitter"
              mr={3}
              onClick={() => {
                likeTweet({ tweetId: tweet.id });
                onClose();
              }}
            >
              Like
            </Button>
          )}
          <Button variant="ghost" colorScheme="twitter" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

