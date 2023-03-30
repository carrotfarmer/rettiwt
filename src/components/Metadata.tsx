import { NextSeo } from "next-seo";
import React from "react";

interface MetadataProps {
  title: string;
  description: string;
}

export const Metadata: React.FC<MetadataProps> = ({ title, description }) => {
  return (
    <>
      <NextSeo
        title={`${title} - rettiwt`}
        defaultTitle={`${title} - rettiwt`}
        description={description}
        canonical="https://rettiwtt.vercel.app"
        openGraph={{
          url: "https://rettiwtt.vercel.app/",
          title: `${title} - rettiwt`,
          description: description,
          // TODO: OG image
          images: [],
        }}
      />
    </>
  );
};
