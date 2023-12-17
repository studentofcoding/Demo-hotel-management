import sanityClient from "@sanity/client";

const client = sanityClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,
    useCdn: process.env.NODE_ENV === "production",
    token: process.env.SANITY_API_TOKEN,
    apiVersion: "2021-10-21",
});

export default client;