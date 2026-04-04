import {
  Box,
  Container,
  Heading,
  HStack,
  Image,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { UserCircle, FileText, Heart } from "lucide-react";
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
            gap={8}
            px={{ base: 2, md: 4 }}
          >
            <HStack gap={3}>
              <Image
                src="/social-ai.svg"
                alt="Social AI"
                boxSize="48px"
                borderRadius="full"
              />
              <Heading size="xl" color="blue.600">
                Social AI
              </Heading>
            </HStack>

            <Box>
              <Heading
                size={{ base: "2xl", md: "3xl" }}
                lineHeight="1.1"
                color="gray.800"
              >
                Join the{" "}
                <Box as="span" color="blue.500">
                  community.
                </Box>
              </Heading>

              <Text
                mt={4}
                fontSize={{ base: "md", md: "lg" }}
                color="gray.500"
                maxW="480px"
                lineHeight="1.7"
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
                icon={<UserCircle size={18} />}
                title="Profile"
                description="Personalize your account"
                color="purple"
              />
              <FeatureCard
                icon={<FileText size={18} />}
                title="Posts"
                description="Share text and images"
                color="blue"
              />
              <FeatureCard
                icon={<Heart size={18} />}
                title="Community"
                description="Like and comment on content"
                color="pink"
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
                  <Text mt={1.5} color="gray.500" fontSize="sm">
                    Sign up and start sharing with the world
                  </Text>
                </Box>

                <RegisterForm />

                <Separator />

                <Box textAlign="center">
                  <Text fontSize="sm" color="gray.500">
                    Already have an account?{" "}
                    <RouterLink to="/login">
                      <Box as="span" color="blue.500" fontWeight="semibold">
                        Sign in
                      </Box>
                    </RouterLink>
                  </Text>
                </Box>
              </VStack>
            </Box>
          </Box>
        </HStack>
      </Container>
    </Box>
  );
};

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "purple" | "pink";
};

const colorMap = {
  blue: { bg: "blue.50", icon: "blue.500" },
  purple: { bg: "purple.50", icon: "purple.500" },
  pink: { bg: "pink.50", icon: "pink.500" },
};

const FeatureCard = ({ icon, title, description, color }: FeatureCardProps) => {
  const c = colorMap[color];
  return (
    <Box
      minW="150px"
      p={4}
      bg="white"
      borderRadius="xl"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.200"
    >
      <Box
        w="36px"
        h="36px"
        bg={c.bg}
        color={c.icon}
        borderRadius="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={3}
      >
        {icon}
      </Box>
      <Text fontWeight="semibold" fontSize="sm" color="gray.800">
        {title}
      </Text>
      <Text mt={0.5} fontSize="xs" color="gray.500">
        {description}
      </Text>
    </Box>
  );
};
