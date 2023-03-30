import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { ChakraProvider } from "@chakra-ui/react";

import { trpc } from "../utils/trpc";
import theme from "../theme";
import { Metadata } from "../components/Metadata";
import Head from "next/head";
import { MetaTags } from "../types/MetaTags";

const MyApp: AppType<{ session: Session | null; metaTags: MetaTags }> = ({
  Component,
  pageProps: { session, metaTags, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        {metaTags &&
          Object.entries(metaTags).map((entry) => (
            // @eslint-ignore
            <meta property={entry[0]} content={entry[1] as string | undefined} />
          ))}
      </Head>
      <ChakraProvider theme={theme}>
        <Metadata
          title="rettiwt"
          description="ultra mid twitter. but at least elon's not here for now."
        />
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
