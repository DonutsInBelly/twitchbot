import { CommandExecInput } from "../typings/CommandTypes";
import BaseCommand from "../util/BaseCommand";

export default class Ping extends BaseCommand {
  constructor() {
    super("ping");
  }

  public exec({ chatClient, channel, user }: CommandExecInput) {
    chatClient.say(channel, `@${user} Pong!!!!`);
  }
}
