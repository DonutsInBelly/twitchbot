import { BaseCommand, CommandExecInput } from "threebot";

export default class Ping extends BaseCommand {
  constructor() {
    super("ping");
  }

  public async exec({ chatClient, channel, user }: CommandExecInput) {
    chatClient.say(channel, `@${user} Pong!!!!`);
  }
}
