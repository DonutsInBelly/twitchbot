import { BaseCommand, CommandExecInput } from "threebot";
import CustomCommandsModel from "../model/CustomCommandsModel";

export default class AddCustomCommand extends BaseCommand {
  // private customCommandClient: CustomCommandsModel;
  constructor() {
    super("addcommand");
    // this.customCommandClient = new CustomCommandsModel();
  }

  public async exec({
    apiClient,
    chatClient,
    channel,
    user,
    tokens,
  }: CommandExecInput) {
    try {
      const customCommandClient = new CustomCommandsModel();
      await customCommandClient.connect();
      await customCommandClient.addCommand(
        tokens[1],
        tokens.slice(2).join(" ")
      );
      chatClient.say(channel, "Command was successfully added.");
    } catch (error) {
      chatClient.say(channel, error);
    }
  }
}
