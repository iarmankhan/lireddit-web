import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Flex,
    Link,
} from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
    const [complete, setComplete] = useState(false);

    const [, forgotPassword] = useForgotPasswordMutation();

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ email: "" }}
                onSubmit={async (values) => {
                    await forgotPassword(values);
                    setComplete(true);
                }}
            >
                {({ isSubmitting }) =>
                    complete ? (
                        <Box mb={4}>
                            <Alert
                                status="success"
                                variant="subtle"
                                flexDirection="column"
                                justifyContent="center"
                                textAlign="center"
                                height="150px"
                            >
                                <AlertIcon size="30px" mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                    Email sent with instructions to recover your
                                    password.
                                </AlertTitle>
                                <AlertDescription maxWidth="sm">
                                    <NextLink href="/login">
                                        <Link>Login</Link>
                                    </NextLink>
                                </AlertDescription>
                            </Alert>
                        </Box>
                    ) : (
                        <Form>
                            <Box>
                                <InputField
                                    name="email"
                                    placeholder="Email"
                                    label="Email"
                                    type="email"
                                />
                            </Box>
                            <Flex
                                align="center"
                                justifyContent="space-between"
                                mt={4}
                            >
                                <Button
                                    type="submit"
                                    variantColor="teal"
                                    isLoading={isSubmitting}
                                >
                                    Submit
                                </Button>
                                <Box>
                                    <NextLink href="/login">
                                        <Link ml="auto">Login</Link>
                                    </NextLink>
                                </Box>
                            </Flex>
                        </Form>
                    )
                }
            </Formik>
        </Wrapper>
    );
};
export default withUrqlClient(createUrqlClient)(ForgotPassword);
