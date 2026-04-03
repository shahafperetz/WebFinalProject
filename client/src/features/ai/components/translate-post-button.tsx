import { useState } from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
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
      setIsShowingTranslation((prev) => !prev);
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
    : "Translate to English";

  return (
    <VStack align="start" gap={2}>
      <HStack gap={3} flexWrap="wrap">
        <Button
          size="sm"
          variant="ghost"
          colorPalette="blue"
          onClick={handleTranslateClick}
          disabled={isLoading || !originalText.trim()}
        >
          {buttonLabel}
        </Button>

        {translatedText ? (
          <Text fontSize="sm" color="gray.600">
            {detectedSourceLanguage
              ? `${detectedSourceLanguage} → English`
              : "Translated to English"}
          </Text>
        ) : null}
      </HStack>

      {isShowingTranslation && translatedText ? (
        <Box
          w="full"
          p={3}
          borderRadius="md"
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
        >
          <Text fontSize="sm" color="gray.700">
            {translatedText}
          </Text>
        </Box>
      ) : null}

      {errorMessage ? (
        <Text fontSize="sm" color="red.500">
          {errorMessage}
        </Text>
      ) : null}
    </VStack>
  );
};
