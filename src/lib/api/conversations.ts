import { apiRequest } from "@/lib/api/client";
import type {
  ChatMessage,
  Conversation,
  ConversationListItem,
  CreateConversationInput,
  MessagesPage,
} from "@/lib/api/types";

export function createConversation(input: CreateConversationInput) {
  return apiRequest<Conversation>("/conversations", {
    method: "POST",
    body: input,
  });
}

export function listConversations(signal?: AbortSignal) {
  return apiRequest<ConversationListItem[]>("/conversations", { signal });
}

export function listMessages(
  conversationId: string,
  query?: { cursor?: string; limit?: number },
  signal?: AbortSignal
) {
  const params = new URLSearchParams();
  if (query?.cursor) params.set("cursor", query.cursor);
  if (query?.limit != null) params.set("limit", String(query.limit));
  const qs = params.toString();
  return apiRequest<MessagesPage>(
    `/conversations/${conversationId}/messages${qs ? `?${qs}` : ""}`,
    { signal }
  );
}

export function sendMessage(conversationId: string, body: string) {
  return apiRequest<ChatMessage>(
    `/conversations/${conversationId}/messages`,
    { method: "POST", body: { body } }
  );
}
