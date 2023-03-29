import React from "react";
import Head from "next/head";

interface MetadataProps {
  title: string;
  description: string;
}

export const Metadata: React.FC<MetadataProps> = ({ title, description }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} key="desc" />

        {/* og stuff */}
        <meta property="og:title" content={`${title} - rettiwt`} />
        <meta property="og:description" content={description} />

        <meta
          property="og:url"
          content="https://rettiwtt.vercel.app/tweet/6ed381a0-458c-4df1-9f6a-e0445c5656dd"
        />
        <meta property="og:type" content="website" />

        <meta property="twitter:domain" content="rettiwtt.vercel.app" />
        <meta
          property="twitter:url"
          content="https://rettiwtt.vercel.app/tweet/6ed381a0-458c-4df1-9f6a-e0445c5656dd"
        />
        <meta name="twitter:title" content={`${title} - rettiwt`} />
        <meta name="twitter:description" content={description} />

        {/* TODO: OG Image */}
      </Head>
    </div>
  );
};

