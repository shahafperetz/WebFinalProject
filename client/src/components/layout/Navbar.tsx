import {
  Avatar,
  Box,
  Flex,
  HStack,
  Heading,
  Menu,
  Portal,
  Spacer,
  Text,
  Image,
  Separator,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { User, FileText, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { useAuth } from "../../features/auth/hooks/use-auth";
import { getImageUrl } from "../../utils/get-image-url";

type NavButtonProps = {
  to: string;
  children: React.ReactNode;
};

const NavButton = ({ to, children }: NavButtonProps) => {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <Box
          position="relative"
          px={4}
          py={3}
          minW="120px"
          textAlign="center"
          borderRadius="md"
          color={isActive ? "blue.500" : "gray.600"}
          fontWeight={isActive ? "semibold" : "medium"}
          cursor="pointer"
          transition="all 0.2s"
          _hover={{ bg: "gray.100", color: "blue.500" }}
        >
          <Text>{children}</Text>
          <Box
            position="absolute"
            left={0}
            right={0}
            bottom="-4px"
            h="3px"
            bg={isActive ? "blue.500" : "transparent"}
            borderRadius="full"
            transition="all 0.2s"
          />
        </Box>
      )}
    </NavLink>
  );
};

export const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { logoutMutation } = useAuth();

  const avatarUrl = user?.image ? getImageUrl(user.image) : "";
  const socialLogo = "/social-ai.svg";

  return (
    <Box
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      px={6}
      py={2}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex align="center" maxW="6xl" mx="auto">
        <HStack gap={2}>
          <Image
            src={socialLogo}
            alt="Social AI"
            boxSize="32px"
            borderRadius="full"
          />
          <Heading size="md">Social AI</Heading>
        </HStack>

        <Spacer />

        <HStack gap={2}>
          <NavButton to="/">Home</NavButton>

          {isAuthenticated && user ? (
            <>
              <NavButton to="/create-post">Create Post</NavButton>

              <Menu.Root>
                <Menu.Trigger asChild>
                  <Box
                    as="button"
                    p={1}
                    borderRadius="full"
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{ bg: "gray.100" }}
                  >
                    <Avatar.Root
                      size="sm"
                      borderRadius="full"
                      overflow="hidden"
                    >
                      {avatarUrl ? <Avatar.Image src={avatarUrl} /> : null}
                      <Avatar.Fallback name={user.username} />
                    </Avatar.Root>
                  </Box>
                </Menu.Trigger>

                <Portal>
                  <Menu.Positioner>
                    <Menu.Content
                      minW="220px"
                      borderRadius="2xl"
                      boxShadow="lg"
                      border="1px solid"
                      borderColor="gray.100"
                      overflow="hidden"
                      p={0}
                    >
                      <Box
                        px={4}
                        py={3}
                        bg="gray.50"
                        borderBottom="1px solid"
                        borderColor="gray.100"
                      >
                        <HStack gap={3}>
                          <Avatar.Root
                            size="sm"
                            borderRadius="full"
                            overflow="hidden"
                          >
                            {avatarUrl ? (
                              <Avatar.Image src={avatarUrl} />
                            ) : null}
                            <Avatar.Fallback name={user.username} />
                          </Avatar.Root>
                          <Box>
                            <Text
                              fontWeight="semibold"
                              fontSize="sm"
                              lineHeight="1.3"
                            >
                              {user.username}
                            </Text>
                            {user.email && (
                              <Text
                                fontSize="xs"
                                color="gray.500"
                                lineHeight="1.3"
                              >
                                {user.email}
                              </Text>
                            )}
                          </Box>
                        </HStack>
                      </Box>

                      <Box p={1.5}>
                        <Menu.Item
                          value="profile"
                          asChild
                          borderRadius="lg"
                          _hover={{ bg: "gray.50" }}
                          px={3}
                          py={2.5}
                        >
                          <NavLink to={`/profile/${user._id}`}>
                            <HStack gap={2.5}>
                              <User
                                size={15}
                                color="var(--chakra-colors-gray-500)"
                              />
                              <Text fontSize="sm">Profile</Text>
                            </HStack>
                          </NavLink>
                        </Menu.Item>

                        <Menu.Item
                          value="my-posts"
                          asChild
                          borderRadius="lg"
                          _hover={{ bg: "gray.50" }}
                          px={3}
                          py={2.5}
                        >
                          <NavLink to="/my-posts">
                            <HStack gap={2.5}>
                              <FileText
                                size={15}
                                color="var(--chakra-colors-gray-500)"
                              />
                              <Text fontSize="sm">My Posts</Text>
                            </HStack>
                          </NavLink>
                        </Menu.Item>

                        <Separator my={1} borderColor="gray.100" />

                        <Menu.Item
                          value="logout"
                          onClick={() => logoutMutation.mutate()}
                          borderRadius="lg"
                          _hover={{ bg: "red.50" }}
                          px={3}
                          py={2.5}
                          color="red.500"
                        >
                          <HStack gap={2.5}>
                            <LogOut size={15} />
                            <Text fontSize="sm">Logout</Text>
                          </HStack>
                        </Menu.Item>
                      </Box>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </>
          ) : (
            <>
              <NavButton to="/login">Login</NavButton>
              <NavButton to="/register">Register</NavButton>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};
