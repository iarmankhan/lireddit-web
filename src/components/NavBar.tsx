import { Box, Button, Flex, Heading, Link } from "@chakra-ui/core";
import React from "react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{ data, fetching }] = useMeQuery({
        pause: isServer(),
    });
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

    let body = null;

    // data is loading
    if (fetching) {
        // user not logged in
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href="/login">
                    <Link color="white" mr={2}>
                        Login
                    </Link>
                </NextLink>
                <NextLink href="/register">
                    <Link color="white">Register</Link>
                </NextLink>
            </>
        );
        // user is logged in
    } else {
        body = (
            <Flex align="center">
                <Box mr={4}>
                    <NextLink href="/create-post">
                        <Button as={Link} ml="auto">
                            Create Post
                        </Button>
                    </NextLink>
                </Box>
                <Box mr={4} color="white">
                    {data.me.username}
                </Box>
                <Button
                    type="button"
                    variant="link"
                    onClick={() => logout()}
                    isLoading={logoutFetching}
                >
                    Logout
                </Button>
            </Flex>
        );
    }

    return (
        <Flex position="sticky" top={0} zIndex={1} bg="tan" p={4}>
            <Flex flex={1} align="center" maxW={800} m="auto">
                <Box>
                    <NextLink href="/">
                        <Link>
                            <Heading as="h1">LiReddit</Heading>
                        </Link>
                    </NextLink>
                </Box>
                <Box ml="auto">{body}</Box>
            </Flex>
        </Flex>
    );
};
