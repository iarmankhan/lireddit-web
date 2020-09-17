import { Box, Button, Flex, Link } from "@chakra-ui/core";
import React from "react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{ data, fetching }] = useMeQuery();
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
            <Flex>
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
        <Flex bg="#222" p={4}>
            <Box ml="auto">{body}</Box>
        </Flex>
    );
};
