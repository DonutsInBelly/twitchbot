import { ChatClient } from "twitch-chat-client/lib";
import { CommandExecInput } from "../typings/CommandTypes";

export default abstract class BaseCommand {
  public commandName: string;
  constructor(commandString: string) {
    this.commandName = commandString;
  }

  getName(): string {
    return this.commandName;
  }

  abstract exec(input: CommandExecInput): void;
}
