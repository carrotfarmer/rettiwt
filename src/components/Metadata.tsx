import Head from "next/head";
import React from "react";

interface MetadataProps {
  title: string;
  description: string;
}

export const Metadata: React.FC<MetadataProps> = ({ title, description }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon-trans.png" />
      </Head>
    </>
  );
};

