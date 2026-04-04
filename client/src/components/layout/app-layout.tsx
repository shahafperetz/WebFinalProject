import { Box, Container } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";

export const AppLayout = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <Box minH="100vh" bg="gray.50">
      {!isAuthPage && <Navbar />}

      <Container
        maxW={isAuthPage ? "full" : "6xl"}
        px={isAuthPage ? 0 : { base: 4, md: 6 }}
        py={isAuthPage ? 0 : 8}
      >
        <Outlet />
      </Container>
    </Box>
  );
};
