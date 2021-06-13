import { ApiClient } from "twitch";
import { RefreshableAuthProvider, StaticAuthProvider } from "twitch-auth";
import { ChatClient } from "twitch-chat-client";
import { PointManager } from "./util/PointManager";
import convert from "convert-units";
import { unit } from "./typings/convertTypes";
import fetch from "node-fetch";
import { CommandHandler } from "threebot";
import path from "path";

require("dotenv").config();
function tofuCheck(message: string): boolean {
  const tokens = message.split(" ");
  return (
    tokens[0].toLowerCase().includes("!") &&
    Number.isInteger(parseInt(tokens[1]))
  );
}

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
  const chatClient = new ChatClient(auth, {
    channels: process.env.CHANNELS?.split(","),
  });
  const pointManager = new PointManager();
  await chatClient.connect();
  const commandDir = path.join(__dirname, "./commands");
  const commandHandler = new CommandHandler(
    commandDir,
    process.env.PREFIX || "!"
  );
  chatClient.onMessage(async (channel, user, message) => {
    const apiClient = new ApiClient({ authProvider: auth });
    const tokens = message.split(" ");
    await commandHandler.getResponse({
      apiClient,
      chatClient,
      channel,
      user,
      tokens,
    });
    if (tokens[0] === "!convert") {
      try {
        const converted = convert(parseFloat(tokens[1]))
          .from(<unit>tokens[2])
          .to(<unit>tokens[3]);
        chatClient.say(channel, `@${user} ${converted} ${tokens[3]}`);
      } catch (e) {
        chatClient.say(
          channel,
          `@${user} Usage: !convert <amount> <from unit> <to unit>. Use !possibilities <unit> to see possibilities for conversions!`
        );
      }
    } else if (tokens[0] === "!possibilities") {
      const possibilities = convert()
        .from(<unit>tokens[1])
        .possibilities();
      chatClient.say(
        channel,
        `@${user} You can convert ${tokens[1]} to any of these: ${possibilities}`
      );
    } else if (tokens[0] === "!y" || tokens[0] === "!n") {
      if (tokens[0] === "!y") {
        const r = await fetch("http://localhost:9090/vote/y");
      } else {
        const r = await fetch("http://localhost:9090/vote/n");
      }
      // !resetpoints username
    } else if (tokens[0] === "!resetpoints") {
      if (process.env.CHANNELS?.includes(user)) {
        await pointManager.resetPoints(tokens[1]);
      }
    }
  });
  const tofuChatClient = new ChatClient(auth, {
    channels: ["LaterTofu"],
  });
  await tofuChatClient.connect();
  tofuChatClient.onMessage(async (channel, user, message) => {
    if (tofuCheck(message) && user.toLowerCase() === "latertofu") {
      setTimeout(() => {
        tofuChatClient.say(channel, "!join");
      }, 5000);
      setTimeout(() => {
        tofuChatClient.say(channel, "Stimmy? latert1OwO");
      }, 632000);
    }
  });
}

main();
