import { BaseCommand, CommandExecInput } from "threebot";
import CustomCommandsModel from "../model/CustomCommandsModel";

export default class AddCustomCommand extends BaseCommand {
  constructor() {
    super("addcommand");
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
      await customCommandClient.addCommand(
        tokens[1],
        tokens.slice(2).join(" ")
      );
      chatClient.say(channel, "Command was successfully added.");
    } catch (error) {
      chatClient.say(channel, error as string);
    } finally {
      await customCommandClient.disconnect();
    }
  }
}
