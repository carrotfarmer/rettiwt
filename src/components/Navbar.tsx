import { Box, Flex, Button, Heading } from "@chakra-ui/react";
import { useSession, signOut, signIn } from "next-auth/react";

export const Navbar = () => {
  const { data: session } = useSession();

  return (
    <Box>
      <Flex bg="twitter.500" p={4}>
        <Heading size="lg" color="white">
          rettiwt
        </Heading>
        <Box ml={"auto"}>
          {session ? (
            <Button colorScheme="twitter" onClick={() => signOut()}>
              sign out
            </Button>
          ) : (
            <Button colorScheme="twitter" onClick={() => signIn("twitter")}>
              sign in
            </Button>
          )}
        </Box>
      </Flex>
    </Box>
  );
};
