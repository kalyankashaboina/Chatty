import axiosInstance from "../utils/axios";
import { ChatMessage } from "../types/types";

export interface PaginatedMessagesResponse {
  messages: ChatMessage[];
  total: number;
}

export const fetchPaginatedMessages = async (
  userId: string,
  selectedUserId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedMessagesResponse> => {
  const res = await axiosInstance.get<PaginatedMessagesResponse>(
    `/chat/last20?userId=${userId}&selectedUserId=${selectedUserId}&page=${page}&limit=${limit}`
  );
  return res.data;
};
