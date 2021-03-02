import { ChatClient } from "twitch-chat-client/lib";
import { ApiClient } from "twitch";

export type CommandExecInput = {
  apiClient: ApiClient;
  chatClient: ChatClient;
  channel: string;
  user: string;
  tokens: string[];
};
