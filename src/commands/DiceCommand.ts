import { CommandExecInput } from "../typings/CommandTypes";
import BaseCommand from "../util/BaseCommand";

export default class DiceCommand extends BaseCommand {
  constructor() {
    super("dice");
  }

  public async exec({ chatClient, channel, user }: CommandExecInput) {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    chatClient.say(channel, `@${user} rolled a ${diceRoll}`);
  }
}
