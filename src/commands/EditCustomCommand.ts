import { BaseCommand, CommandExecInput } from "threebot";
import CustomCommandsModel from "../model/CustomCommandsModel";

export default class EditCustomCommand extends BaseCommand {
  constructor() {
    super("editcommand");
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
      const commandValue = tokens.slice(2).join(" ");
      const result = await customCommandClient.editCustomCommand(
        tokens[1],
        commandValue
      );
      if (result) {
        chatClient.say(channel, "Command updated successfully!");
      }
    } catch (error) {
      chatClient.say(channel, error);
    }
  }
}
