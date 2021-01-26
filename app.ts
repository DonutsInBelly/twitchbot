import { RefreshableAuthProvider, StaticAuthProvider } from "twitch-auth";
import { ChatClient } from "twitch-chat-client";

require("dotenv").config();

async function main() {
  const clientId = process.env.TWITCH_CLIENT_ID || "";
  const accessToken = process.env.TWITCH_ACCESS_TOKEN || "";
  const clientSecret = process.env.TWITCH_CLIENT_SECRET || "";
  const refreshToken = process.env.TWITCH_REFRESH_TOKEN || "";
  const auth = new RefreshableAuthProvider(
    new StaticAuthProvider(clientId, accessToken),
    {
      clientSecret,
      refreshToken,
    }
  );
  const chatClient = new ChatClient(auth, { channels: ["dominusbelli"] });
  await chatClient.connect();
  chatClient.onMessage((channel, user, message) => {
    if (message === "!ping") {
      chatClient.say(channel, "Pong!");
    } else if (message === "!dice") {
      const diceRoll = Math.floor(Math.random() * 6) + 1;
      chatClient.say(channel, `@${user} rolled a ${diceRoll}`);
    }
  });
}

main();
