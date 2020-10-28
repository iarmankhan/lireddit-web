import { Box, CircularProgress, Flex, Heading, Text } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../../components/Layout";
import { PostActions } from "../../components/PostActions";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";

const Post = ({}) => {
    const [{ data, fetching }] = useGetPostFromUrl();

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
            <Box mt={5}>
                <Flex align="center" justifyContent="space-between">
                    <Box>
                        <Heading>{data.post.title}</Heading>
                        <Text mt={2} color="grey">
                            Posted by {data.post.creator.username}
                        </Text>
                    </Box>
                    <PostActions
                        id={data.post.id}
                        creatorId={data.post.creator.id}
                    />
                </Flex>
                <Box mt={10}>
                    <Text>{data.post.text}</Text>
                </Box>
            </Box>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
