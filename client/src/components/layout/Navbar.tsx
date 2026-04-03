import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Menu,
  Portal,
  Spacer,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { useAuth } from "../../features/auth/hooks/use-auth";
import { getImageUrl } from "../../utils/get-image-url";

type NavButtonProps = {
  to: string;
  children: React.ReactNode;
  colorPalette?: string;
};

const NavButton = ({ to, children, colorPalette }: NavButtonProps) => {
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
};

export const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { logoutMutation } = useAuth();

  const avatarUrl = user?.image ? getImageUrl(user.image) : "";

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

          {isAuthenticated && user ? (
            <>
              <NavButton to="/create-post" colorPalette="blue">
                Create Post
              </NavButton>

              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button variant="ghost" p={1} borderRadius="full">
                    <Avatar.Root size="sm">
                      {avatarUrl ? <Avatar.Image src={avatarUrl} /> : null}
                      <Avatar.Fallback name={user.username} />
                    </Avatar.Root>
                  </Button>
                </Menu.Trigger>

                <Portal>
                  <Menu.Positioner>
                    <Menu.Content minW="180px">
                      <Menu.Item value="profile" asChild>
                        <NavLink to={`/profile/${user._id ?? user.id}`}>
                          Profile
                        </NavLink>
                      </Menu.Item>

                      <Menu.Item value="my-posts" asChild>
                        <NavLink to="/my-posts">My Posts</NavLink>
                      </Menu.Item>

                      <Menu.Item
                        value="logout"
                        onClick={() => logoutMutation.mutate()}
                      >
                        Logout
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
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
};
