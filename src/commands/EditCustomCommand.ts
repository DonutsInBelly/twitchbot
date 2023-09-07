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
    const customCommandClient = new CustomCommandsModel();
    try {
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
      chatClient.say(channel, error as string);
    } finally {
      await customCommandClient.disconnect();
    }
  }
}
