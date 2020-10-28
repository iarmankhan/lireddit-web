import { Flex, IconButton, Link } from "@chakra-ui/core";
import React from "react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface PostActionsProps {
    id: number;
    creatorId: number;
}

export const PostActions: React.FC<PostActionsProps> = ({ id, creatorId }) => {
    const [, deletePost] = useDeletePostMutation();
    const [user] = useMeQuery({
        pause: isServer(),
    });

    if (user.data?.me?.id !== creatorId) {
        return null;
    }

    return (
        <Flex>
            <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
                <IconButton
                    icon="edit"
                    aria-label="Edit post"
                    mr={2}
                    as={Link}
                />
            </NextLink>
            <IconButton
                icon="delete"
                aria-label="Delete post"
                onClick={() => deletePost({ id })}
            />
        </Flex>
    );
};
