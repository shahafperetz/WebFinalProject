import { Box, Text } from "@chakra-ui/react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <Box mb={6}>
      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
        {title}
      </Text>
      {subtitle && (
        <Text color="gray.500" fontSize="sm" mt={0.5}>
          {subtitle}
        </Text>
      )}
    </Box>
  );
};
