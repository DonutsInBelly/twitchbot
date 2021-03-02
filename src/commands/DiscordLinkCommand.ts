import { CommandExecInput } from "../typings/CommandTypes";
import BaseCommand from "../util/BaseCommand";

export default class DiscordLinkCommand extends BaseCommand {
  constructor() {
    super("discord");
  }

  public async exec({ chatClient, channel, user }: CommandExecInput) {
    chatClient.say(
      channel,
      `@${user} here's a link to the Discord community! ${process.env.DISCORD_SERVER_INVITE}`
    );
  }
}
