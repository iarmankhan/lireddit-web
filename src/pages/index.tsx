import React, { useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Flex,
    Heading,
    Link,
    Stack,
    Text,
} from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";

const Index = () => {
    const [variables, setVariables] = useState({
        limit: 10,
        cursor: null as null | string,
    });
    const [{ data, fetching }] = usePostsQuery({ variables });

    if (!fetching && !data) {
        return (
            <Box>
                <Text>No posts availble!</Text>
            </Box>
        );
    }

    return (
        <Layout>
            <Flex align="right">
                <NextLink href="/create-post">
                    <Link ml="auto">Create Post</Link>
                </NextLink>
            </Flex>

            {!data && fetching ? (
                <Box>
                    <CircularProgress
                        isIndeterminate
                        color="green"
                    ></CircularProgress>
                </Box>
            ) : (
                <Stack spacing={8}>
                    {data!.posts.map((p) => (
                        <Box p={5} key={p.id} shadow="md" borderWidth="1px">
                            <Heading fontSize="xl">{p.title}</Heading>
                            <Text mt={4}>{p.textSnippet}</Text>
                        </Box>
                    ))}
                </Stack>
            )}
            {data ? (
                <Flex my={8}>
                    <Button
                        onClick={() =>
                            setVariables({
                                limit: variables.limit,
                                cursor:
                                    data.posts[data.posts.length - 1].createdAt,
                            })
                        }
                        isLoading={fetching}
                        m="auto"
                    >
                        Load more
                    </Button>
                </Flex>
            ) : null}
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
