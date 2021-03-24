import { UserIdResolvable } from "twitch";
import { CommandExecInput } from "../typings/CommandTypes";
import BaseCommand from "../util/BaseCommand";

export default class ShoutoutCommand extends BaseCommand {
  constructor() {
    super("so");
  }

  public async exec({
    apiClient,
    chatClient,
    channel,
    user,
    tokens,
  }: CommandExecInput) {
    let shoutout = tokens[1].toLowerCase();
    if (shoutout.startsWith("@")) {
      shoutout = shoutout.slice(1);
    }
    try {
      const bannedWords = process.env.SHYXYLA_BANNED_WORDS || "";
      if (
        user.toLowerCase().includes("shyxyla") &&
        shoutout.includes(bannedWords)
      ) {
        chatClient.timeout(channel, "shyxyla", 5);
      }
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
      console.log(e);
      chatClient.say(
        channel,
        `Couldn't find a user with the name of ${shoutout}`
      );
    }
  }
}
