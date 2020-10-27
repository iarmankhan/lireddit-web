import { Box, CircularProgress, Flex, Heading, Text } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

const Post = ({}) => {
    const router = useRouter();
    const intId =
        typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
    const [{ data, fetching }] = usePostQuery({
        pause: intId === -1,
        variables: {
            id: intId,
        },
    });

    if (fetching) {
        return (
            <Layout>
                <Flex height={200} alignItems="center" justifyContent="center">
                    <CircularProgress isIndeterminate color="green" />
                </Flex>
            </Layout>
        );
    }

    if (!data?.post) {
        return (
            <Layout>
                <Box>
                    <Text>No data available</Text>
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Heading>{data.post.title}</Heading>
            <Text>{data.post.text}</Text>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
