import { Box, Container } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";

export const AppLayout = () => {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <Box minH="100vh" bg="gray.50">
      {!hideNavbar ? <Navbar /> : null}

      <Container maxW="6xl" py={hideNavbar ? 0 : 8}>
        <Outlet />
      </Container>
    </Box>
  );
};
