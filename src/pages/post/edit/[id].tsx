import { Box, Button, Text, Flex, CircularProgress } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { useUpdatePostMutation } from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useGetPostFromUrl } from "../../../utils/useGetPostFromUrl";
import { useGetPostId } from "../../../utils/useGetPostId";

interface EditPostProps {}

const EditPost: React.FC<EditPostProps> = ({}) => {
    const router = useRouter();
    const intId = useGetPostId();
    const [{ data, fetching }] = useGetPostFromUrl();
    const [, updatePost] = useUpdatePostMutation();

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
        <Layout variant="small">
            <Formik
                initialValues={{
                    title: data.post.title,
                    text: data.post.text,
                }}
                onSubmit={async (values) => {
                    await updatePost({
                        id: intId,
                        ...values,
                    });
                    router.back();
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Box>
                            <InputField
                                name="title"
                                placeholder="Title"
                                label="Title"
                            />
                        </Box>
                        <Box mt={4}>
                            <InputField
                                name="text"
                                placeholder="Content"
                                label="Content"
                                textarea
                            />
                        </Box>
                        <Box mt={4}>
                            <Button
                                type="submit"
                                variantColor="teal"
                                isLoading={isSubmitting}
                            >
                                Update Post
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(EditPost);
