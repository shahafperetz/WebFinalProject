import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { RegisterForm } from "../features/auth/components/register-form";

export const RegisterPage = () => {
  return (
    <Box minH="calc(100vh - 80px)" bg="gray.50" py={{ base: 8, md: 16 }}>
      <Container maxW="7xl">
        <HStack
          align="stretch"
          gap={{ base: 8, md: 16 }}
          flexDirection={{ base: "column", lg: "row" }}
        >
          <VStack
            flex="1"
            align="start"
            justify="center"
            gap={6}
            px={{ base: 2, md: 4 }}
          >
            <Box>
              <Heading
                size={{ base: "2xl", md: "3xl" }}
                lineHeight="1.1"
                color="blue.600"
              >
                Join Social AI App
              </Heading>

              <Text
                mt={4}
                fontSize={{ base: "lg", md: "2xl" }}
                color="gray.700"
                maxW="560px"
                lineHeight="1.5"
              >
                Create an account, share your posts, upload images, and connect
                with your community through a smart social experience.
              </Text>
            </Box>

            <HStack
              gap={4}
              flexWrap="wrap"
              display={{ base: "none", md: "flex" }}
            >
              <FeatureCard
                title="Profile"
                description="Personalize your account"
              />
              <FeatureCard title="Posts" description="Share text and images" />
              <FeatureCard
                title="Community"
                description="Like and comment on content"
              />
            </HStack>
          </VStack>

          <Box
            flex="1"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              w="full"
              maxW="md"
              bg="white"
              borderRadius="2xl"
              boxShadow="xl"
              border="1px solid"
              borderColor="gray.200"
              p={{ base: 6, md: 8 }}
            >
              <VStack align="stretch" gap={5}>
                <Box textAlign="center">
                  <Heading size="lg">Create Account</Heading>
                  <Text mt={2} color="gray.600">
                    Sign up to start sharing content
                  </Text>
                </Box>

                <RegisterForm />

                <Separator />

                <Button asChild size="lg" variant="outline" colorPalette="blue">
                  <RouterLink to="/login">Already have an account?</RouterLink>
                </Button>

                <Text textAlign="center" color="gray.500" fontSize="sm">
                  Google / Facebook registration can be added here next.
                </Text>
              </VStack>
            </Box>
          </Box>
        </HStack>
      </Container>
    </Box>
  );
};

type FeatureCardProps = {
  title: string;
  description: string;
};

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <Box
      minW="160px"
      p={4}
      bg="white"
      borderRadius="xl"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.200"
    >
      <Text fontWeight="bold" color="gray.800">
        {title}
      </Text>
      <Text mt={1} fontSize="sm" color="gray.600">
        {description}
      </Text>
    </Box>
  );
}
