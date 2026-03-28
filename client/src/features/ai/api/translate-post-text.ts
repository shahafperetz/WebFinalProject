import { apiClient } from "../../../api/client";

export type TranslatePostResponse = {
  message: string;
  translatedText: string;
  detectedSourceLanguage?: string;
};

export const translatePostText = async (
  postId: string
): Promise<TranslatePostResponse> => {
  const response = await apiClient.post<TranslatePostResponse>(
    `/ai/translate/${postId}`
  );

  return response.data;
};
