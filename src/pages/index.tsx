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
import NextLink from "next/link";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { PostActions } from "../components/PostActions";
import { UpdootSection } from "../components/UpdootSection";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isServer } from "../utils/isServer";

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
            {!data && fetching ? (
                <Flex height={200} alignItems="center" justifyContent="center">
                    <CircularProgress isIndeterminate color="green" />
                </Flex>
            ) : (
                <Stack spacing={8}>
                    {data!.posts.posts.map((p) =>
                        !p ? null : (
                            <Flex
                                p={5}
                                key={p.id}
                                shadow="md"
                                borderWidth="1px"
                                align="center"
                            >
                                <UpdootSection post={p} />
                                <Box w="100%">
                                    <NextLink
                                        href="/post/[id]"
                                        as={`/post/${p.id}`}
                                    >
                                        <Link>
                                            <Heading fontSize="xl">
                                                {p.title}
                                            </Heading>
                                        </Link>
                                    </NextLink>
                                    <Text fontSize="xs">
                                        Posted by {p.creator.username}
                                    </Text>
                                    <Text mt={4}>{p.textSnippet}</Text>
                                </Box>
                                <PostActions
                                    id={p.id}
                                    creatorId={p.creator.id}
                                />
                            </Flex>
                        )
                    )}
                </Stack>
            )}
            {data && data.posts.hasMore ? (
                <Flex my={8}>
                    <Button
                        onClick={() =>
                            setVariables({
                                limit: variables.limit,
                                cursor:
                                    data.posts.posts[
                                        data.posts.posts.length - 1
                                    ].createdAt,
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
