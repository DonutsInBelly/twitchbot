import { BaseCommand, CommandExecInput } from "threebot";
import PointsModel from "../model/PointsModel";

export default class PointsCommand extends BaseCommand {
  constructor() {
    super("points");
  }

  public async exec({
    apiClient,
    chatClient,
    channel,
    user,
    tokens,
  }: CommandExecInput) {
    const pointsModelClient = new PointsModel();
    try {
      await pointsModelClient.connect();

      const pointsResponse = await pointsModelClient.getPoints(user);

      if (pointsResponse) {
        chatClient.say(
          channel,
          `@${user}, you currently have ${pointsResponse.points} points!`
        );
      }
    } catch (error) {
      chatClient.say(channel, error as string);
    } finally {
      await pointsModelClient.disconnect();
    }
  }
}
