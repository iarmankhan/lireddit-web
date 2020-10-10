import {
    Alert,
    AlertIcon,
    Box,
    Button,
    AlertTitle,
    AlertDescription,
    Link,
} from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";

import NextLink from "next/link";

const ChangePassword: NextPage = () => {
    const router = useRouter();
    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState("");

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ newPassword: "", confirmPassword: "" }}
                onSubmit={async (values, { setErrors }) => {
                    if (values.newPassword !== values.confirmPassword) {
                        setErrors({
                            confirmPassword: "Both Password should match",
                        });
                        return;
                    }

                    const response = await changePassword({
                        newPassword: values.newPassword,
                        token:
                            typeof router.query.token === "string"
                                ? router.query.token
                                : "",
                    });
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(
                            response.data.changePassword.errors
                        );

                        if ("token" in errorMap) {
                            setTokenError(errorMap.token);
                        }

                        setErrors(errorMap);
                    } else if (response.data?.changePassword.user) {
                        // Registered
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        {tokenError !== "" ? (
                            <Box mb={4}>
                                <Alert
                                    status="error"
                                    variant="subtle"
                                    flexDirection="column"
                                    justifyContent="center"
                                    textAlign="center"
                                    height="150px"
                                >
                                    <AlertIcon size="30px" mr={0} />
                                    <AlertTitle mt={4} mb={1} fontSize="lg">
                                        {tokenError}
                                    </AlertTitle>
                                    <AlertDescription maxWidth="sm">
                                        <NextLink href="/forgot-password">
                                            <Link>
                                                Click here to get a new one!
                                            </Link>
                                        </NextLink>
                                    </AlertDescription>
                                </Alert>
                            </Box>
                        ) : null}

                        <Box>
                            <InputField
                                name="newPassword"
                                placeholder="New Password"
                                label="New Password"
                                type="password"
                            />
                        </Box>
                        <Box mt={4}>
                            <InputField
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                label="Confirm Password"
                                type="password"
                            />
                        </Box>
                        <Button
                            type="submit"
                            variantColor="teal"
                            mt={4}
                            isLoading={isSubmitting}
                        >
                            Change Password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
