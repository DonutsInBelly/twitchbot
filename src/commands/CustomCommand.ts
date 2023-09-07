import { BaseCommand, CommandExecInput } from "threebot";

import CustomCommandsModel from "../model/CustomCommandsModel";

export default class CustomCommand extends BaseCommand {
  constructor() {
    super("custom", true);
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
      const customResponse = await customCommandClient.findCustomCommand(
        tokens[0].substr(1)
      );
      if (customResponse?.response) {
        const str = fillTemplate(customResponse.response, {
          user: user,
          count: customResponse.count,
        });
        chatClient.say(channel, str);
      }
    } catch (error) {
      chatClient.say(channel, error as string);
    }
  }
}

const fillTemplate = (templateString: string, templateVariables: any) =>
  templateString.replace(/\${(.*?)}/g, (_, g) => templateVariables[g]);
