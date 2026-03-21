import { Box } from "@chakra-ui/react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../hooks/use-auth";

export function GoogleLoginButton() {
  const { googleLoginMutation } = useAuth();

  return (
    <Box>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (!credentialResponse.credential) return;
          googleLoginMutation.mutate(credentialResponse.credential);
        }}
        onError={() => {
          console.error("Google Login Failed");
        }}
      />
    </Box>
  );
}
