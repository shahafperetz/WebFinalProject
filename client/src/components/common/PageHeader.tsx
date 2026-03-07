import { Heading, Text, VStack } from "@chakra-ui/react";

type Props = {
  title: string;
  subtitle?: string;
};

export function PageHeader({ title, subtitle }: Props) {
  return (
    <VStack align="start" gap={1} mb={6}>
      <Heading>{title}</Heading>
      {subtitle ? <Text color="gray.600">{subtitle}</Text> : null}
    </VStack>
  );
}
