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
import { LoginForm } from "../features/auth/components/login-form";
import { GoogleLoginButton } from "../features/auth/components/google-login-button";

export const LoginPage = () => {
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
                Social AI App
              </Heading>

              <Text
                mt={4}
                fontSize={{ base: "lg", md: "2xl" }}
                color="gray.700"
                maxW="560px"
                lineHeight="1.5"
              >
                Share posts, discover content, and interact with your community
                in one smart social platform.
              </Text>
            </Box>

            <HStack
              gap={4}
              flexWrap="wrap"
              display={{ base: "none", md: "flex" }}
            >
              <FeatureCard title="Posts" description="Share text and images" />
              <FeatureCard title="Comments" description="Join the discussion" />
              <FeatureCard title="AI" description="Search content smartly" />
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
                  <Heading size="lg">Login</Heading>
                  <Text mt={2} color="gray.600">
                    Sign in to continue to the application
                  </Text>
                </Box>

                <LoginForm />

                <GoogleLoginButton />

                <Separator />

                <Button asChild size="lg" variant="outline" colorPalette="blue">
                  <RouterLink to="/register">Create new account</RouterLink>
                </Button>
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
