import fs from "fs/promises";
import path from "path";
import { CommandExecInput } from "./typings/CommandTypes";

export default class CommandHandler {
  private commandMapping: Map<string, Function>;
  private prefix: string;
  constructor(directory: string, prefix: string) {
    this.commandMapping = new Map();
    this.prefix = prefix;
    const commandDir = path.join(__dirname, directory);
    fs.readdir(commandDir).then(async (files) => {
      for (const file of files) {
        const CommandClass = <any>await import(`${commandDir}/${file}`);
        const command = new CommandClass.default();
        this.commandMapping.set(command.getName(), command.exec);
      }
    });
  }

  public async getResponse({
    chatClient,
    channel,
    user,
    tokens,
  }: CommandExecInput): Promise<void> {
    if (tokens[0].charAt(0) === this.prefix) {
      const commandString = tokens[0].slice(1);
      const executeFunction = <Function>this.commandMapping.get(commandString);
      await executeFunction({ chatClient, channel, user, tokens });
    }
  }
}
