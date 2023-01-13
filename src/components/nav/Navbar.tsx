import {
  Box,
  Flex,
  Button,
  Heading,
  Avatar,
  PopoverTrigger,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  Text,
} from "@chakra-ui/react";

import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import router from "next/router";

export const Navbar = () => {
  const { data: session } = useSession();

  return (
    <Box>
      <Flex bg="twitter.500" p={6}>
        <Link href="/">
          <Heading size="xl" color="white">
            rettiwt
          </Heading>
        </Link>
        <Box ml={"auto"}>
          {session ? (
            <Button colorScheme="twitter" onClick={() => signOut()} size="lg">
              sign out
            </Button>
          ) : (
            <Button colorScheme="twitter" onClick={() => signIn("twitter")}>
              sign in
            </Button>
          )}

          {session && (
            <Popover>
              <PopoverTrigger>
                <Avatar ml={4} src={session?.user?.image as string} />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>
                  <Text fontWeight="bold">{session?.user?.name}</Text>
                </PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  <Button
                    colorScheme="twitter"
                    onClick={() => router.push(`/profile/${session?.user?.id}`)}
                  >
                    My Profile
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
        </Box>
      </Flex>
    </Box>
  );
};
