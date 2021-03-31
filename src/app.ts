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
    if (message === "!points") {
      const userCurrentPoints = await pointManager.getUserCurrentPoints(user);
      chatClient.say(
        channel,
        `@${user}, you currently have *checks notes* ${userCurrentPoints} points!`
      );
    } else if (tokens[0] === "!gamble") {
      // try {
      //   if (tokens[1]) {
      //     const wager = Number(tokens[1]);
      //     if (Number.isInteger(wager) && wager > 0) {
      //       const result = await pointManager.gamble(user, wager);
      //       chatClient.say(
      //         channel,
      //         `@${user} gambled and rolled a ${result.rolled} and ${
      //           result.verb
      //         } ${
      //           result.verb === "won" ? wager * 2 : wager
      //         } points! They now have ${result.newPoints} points! 🚀 💎 🙌`
      //       );
      //     } else {
      //       throw Error(
      //         `invalid input given, please enter a non-zero, positive integer! Invalid: ${tokens[1]}`
      //       );
      //     }
      //   } else {
      //     throw Error(
      //       `could not read your wager! Please use the format !gamble <wager>`
      //     );
      //   }
      // } catch (e) {
      //   chatClient.say(
      //     channel,
      //     `@${user} Woops! We hit an error: ${e.message}`
      //   );
      // }
    } else if (tokens[0] === "!convert") {
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
}

main();
