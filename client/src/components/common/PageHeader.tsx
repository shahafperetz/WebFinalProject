import { Heading, Text, VStack } from "@chakra-ui/react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <VStack align="start" gap={1} mb={6}>
      <Heading>{title}</Heading>
      {subtitle ? <Text color="gray.600">{subtitle}</Text> : null}
    </VStack>
  );
};
