import { BaseCommand, CommandExecInput } from "threebot";

export default class RiggyCommand extends BaseCommand {
  constructor() {
    super("riggy");
  }

  public async exec({ chatClient, channel }: CommandExecInput) {
    chatClient.say(
      channel,
      "riggy2Seduce riggy2Seduce riggy2Seduce riggy2Seduce"
    );
  }
}
