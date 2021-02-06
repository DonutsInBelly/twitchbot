import { ApiClient, UserIdResolvable } from "twitch";
import { RefreshableAuthProvider, StaticAuthProvider } from "twitch-auth";
import { ChatClient } from "twitch-chat-client";
import { PointManager } from "./util/PointManager";
import convert from "convert-units";
import { unit } from "./typings/convertTypes";

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
  const chatClient = new ChatClient(auth, {
    channels: ["dominusbelli", "mahcus_ttv"],
  });
  const pointManager = new PointManager();
  await chatClient.connect();
  chatClient.onMessage(async (channel, user, message) => {
    const tokens = message.split(" ");
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
    } else if (message === "!points") {
      const userCurrentPoints = await pointManager.getUserCurrentPoints(user);
      chatClient.say(
        channel,
        `@${user}, you currently have *checks notes* ${userCurrentPoints} points!`
      );
    } else if (tokens[0] === "!gamble") {
      try {
        if (tokens[1]) {
          const wager = Number(tokens[1]);
          if (Number.isInteger(wager) && wager > 0) {
            const result = await pointManager.gamble(user, wager);
            chatClient.say(
              channel,
              `@${user} gambled and rolled a ${result.rolled} and ${
                result.verb
              } ${
                result.verb === "won" ? wager * 2 : wager
              } points! They now have ${result.newPoints} points! 🚀 💎 🙌`
            );
          } else {
            throw Error(
              `invalid input given, please enter a non-zero, positive integer! Invalid: ${tokens[1]}`
            );
          }
        } else {
          throw Error(
            `could not read your wager! Please use the format !gamble <wager>`
          );
        }
      } catch (e) {
        chatClient.say(
          channel,
          `@${user} Woops! We hit an error: ${e.message}`
        );
      }
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
    }
  });
}

main();
