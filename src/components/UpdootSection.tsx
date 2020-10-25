import { Box, Flex, IconButton, Text } from "@chakra-ui/core";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
    post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    const [loading, setLoading] = useState<
        "updoot-loading" | "downdoot-loading" | "not-loading"
    >("not-loading");
    const [, vote] = useVoteMutation();

    return (
        <Flex direction="column" align="center" mr={5}>
            <IconButton
                onClick={async () => {
                    if (post.voteStatus === 1) {
                        return;
                    }

                    setLoading("updoot-loading");
                    await vote({ postId: post.id, value: 1 });
                    setLoading("not-loading");
                }}
                variantColor={post.voteStatus === 1 ? "orange" : undefined}
                aria-label="Updoot post"
                icon="chevron-up"
                isLoading={loading === "updoot-loading"}
                size="sm"
                fontSize="20px"
            />
            <Box m={1}>
                <Text>{post.points}</Text>
            </Box>
            <IconButton
                onClick={async () => {
                    if (post.voteStatus === -1) {
                        return;
                    }

                    setLoading("downdoot-loading");
                    await vote({ postId: post.id, value: -1 });
                    setLoading("not-loading");
                }}
                variantColor={post.voteStatus === -1 ? "blue" : undefined}
                aria-label="Downdoot post"
                icon="chevron-down"
                isLoading={loading === "downdoot-loading"}
                size="sm"
                fontSize="20px"
            />
        </Flex>
    );
};
