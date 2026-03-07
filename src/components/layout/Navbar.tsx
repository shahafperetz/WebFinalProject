import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { useAuth } from "../../features/auth/hooks/useAuth";

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { logoutMutation } = useAuth();

  return (
    <Box
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      px={6}
      py={4}
    >
      <Flex align="center" maxW="6xl" mx="auto">
        <Heading size="md">Social AI App</Heading>

        <Spacer />

        <HStack gap={3}>
          <Button asChild variant="ghost">
            <RouterLink to="/">Home</RouterLink>
          </Button>

          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost">
                <RouterLink to={`/profile/${user?.id ?? ""}`}>
                  Profile
                </RouterLink>
              </Button>

              <Text color="gray.600">{user?.username}</Text>

              <Button
                variant="outline"
                onClick={() => logoutMutation.mutate()}
                loading={logoutMutation.isPending}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <RouterLink to="/login">Login</RouterLink>
              </Button>

              <Button asChild colorPalette="blue">
                <RouterLink to="/register">Register</RouterLink>
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
