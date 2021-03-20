import { BaseCommand, CommandExecInput } from "threebot";

export default class RaidCommand extends BaseCommand {
  constructor() {
    super("raid");
  }

  public async exec({ chatClient, channel }: CommandExecInput) {
    chatClient.say(
      channel,
      "TombRaid GET IN MY BELLI TombRaid GET IN MY BELLI TombRaid GET IN MY BELLI TombRaid GET IN MY BELLI TombRaid GET IN MY BELLI TombRaid GET IN MY BELLI TombRaid GET IN MY BELLI "
    );
  }
}
