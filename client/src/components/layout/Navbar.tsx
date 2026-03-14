import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { useAuth } from "../../features/auth/hooks/useAuth";

type NavButtonProps = {
  to: string;
  children: React.ReactNode;
  colorPalette?: string;
};

function NavButton({ to, children, colorPalette }: NavButtonProps) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <Button
          variant={isActive ? "solid" : "ghost"}
          colorPalette={isActive ? colorPalette ?? "blue" : undefined}
        >
          {children}
        </Button>
      )}
    </NavLink>
  );
}

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
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex align="center" maxW="6xl" mx="auto">
        <Heading size="md">Social AI App</Heading>

        <Spacer />

        <HStack gap={3}>
          <NavButton to="/">Home</NavButton>

          {isAuthenticated ? (
            <>
              <NavButton to="/create-post" colorPalette="blue">
                Create Post
              </NavButton>

              <NavButton to={`/profile/${user?._id ?? user?.id ?? ""}`}>
                Profile
              </NavButton>

              <NavButton to="/my-posts">My Posts</NavButton>

              <Text color="gray.600" fontWeight="medium">
                {user?.username}
              </Text>

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
              <NavButton to="/login">Login</NavButton>
              <NavButton to="/register" colorPalette="blue">
                Register
              </NavButton>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
