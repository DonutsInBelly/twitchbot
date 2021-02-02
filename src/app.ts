import { ApiClient, UserIdResolvable } from "twitch";
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
  const apiClient = new ApiClient({ authProvider: auth });
  const chatClient = new ChatClient(auth, { channels: ["dominusbelli"] });
  await chatClient.connect();
  chatClient.onMessage(async (channel, user, message) => {
    if (message === "!ping") {
      chatClient.say(channel, "Pong!");
    } else if (message === "!dice") {
      const diceRoll = Math.floor(Math.random() * 6) + 1;
      chatClient.say(channel, `@${user} rolled a ${diceRoll}`);
    } else if (message === "!discord") {
      chatClient.say(
        channel,
        `@${user} here's a link to the Discord community! https://discord.gg/hhAUwzcuwT`
      );
    } else if (message.substring(0, 3).includes("!so")) {
      let shoutout = message.slice(4);
      if (shoutout.startsWith("@")) {
        shoutout = shoutout.slice(1);
      }
      try {
        const shoutoutUserInfo = await apiClient.helix.users.getUserByName(
          shoutout
        );
        const shoutoutChannelInfo = await apiClient.helix.channels.getChannelInfo(
          shoutoutUserInfo?.id as UserIdResolvable
        );
        chatClient.say(
          channel,
          `Check out @${shoutout}! They were last seen playing ${shoutoutChannelInfo?.gameName}! https://www.twitch.tv/${shoutout}`
        );
      } catch (e) {
        chatClient.say(
          channel,
          `Couldn't find a user with the name of ${shoutout}`
        );
      }
    }
  });
}

main();
