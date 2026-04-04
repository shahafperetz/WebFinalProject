import { useState } from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { Languages } from "lucide-react";
import { translatePostText } from "../api/translate-post-text";
import { getErrorMessage } from "../../../utils/get-error-message";

type TranslatePostButtonProps = {
  postId: string;
  originalText: string;
};

export const TranslatePostButton = ({
  postId,
  originalText,
}: TranslatePostButtonProps) => {
  const [translatedText, setTranslatedText] = useState("");
  const [detectedSourceLanguage, setDetectedSourceLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingTranslation, setIsShowingTranslation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTranslateClick = async () => {
    if (!originalText.trim()) return;
    if (translatedText) {
      setIsShowingTranslation((p) => !p);
      return;
    }
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await translatePostText(postId);
      setTranslatedText(response.translatedText);
      setDetectedSourceLanguage(response.detectedSourceLanguage ?? "");
      setIsShowingTranslation(true);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "AI translate failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const buttonLabel = isLoading
    ? "Translating..."
    : translatedText
    ? isShowingTranslation
      ? "Hide translation"
      : "Show translation"
    : "Translate";

  return (
    <VStack align="start" gap={2}>
      <HStack gap={2} align="center">
        <Button
          size="xs"
          variant="ghost"
          colorPalette="blue"
          borderRadius="full"
          px={3}
          onClick={handleTranslateClick}
          disabled={isLoading || !originalText.trim()}
          color="blue.500"
          _hover={{ bg: "blue.50" }}
        >
          <HStack gap={1}>
            <Languages size={12} />
            <Text fontSize="xs">{buttonLabel}</Text>
          </HStack>
        </Button>

        {translatedText && (
          <Text fontSize="xs" color="gray.400">
            {detectedSourceLanguage
              ? `${detectedSourceLanguage} → English`
              : "Translated"}
          </Text>
        )}
      </HStack>

      {isShowingTranslation && translatedText && (
        <Box
          w="full"
          p={3}
          borderRadius="xl"
          bg="blue.50"
          borderLeft="3px solid"
          borderColor="blue.200"
        >
          <Text fontSize="sm" color="gray.700" lineHeight="1.6">
            {translatedText}
          </Text>
        </Box>
      )}

      {errorMessage && (
        <Text fontSize="xs" color="red.400">
          {errorMessage}
        </Text>
      )}
    </VStack>
  );
};
