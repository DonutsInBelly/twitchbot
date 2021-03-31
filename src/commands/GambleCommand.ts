import { BaseCommand, CommandExecInput } from "threebot";
import PointsModel from "../model/PointsModel";

export default class GambleCommand extends BaseCommand {
  constructor() {
    super("gamble");
  }

  public async exec({
    apiClient,
    chatClient,
    channel,
    user,
    tokens,
  }: CommandExecInput) {
    if (tokens[1]) {
      const wager = Number(tokens[1]);
      if (Number.isInteger(wager) && wager > 0) {
        try {
          const pointsModelClient = new PointsModel();
          await pointsModelClient.connect();

          const pointsResponse = await pointsModelClient.getPoints(user);

          if (pointsResponse) {
            const wager = Number(tokens[1]);
            let currentPoints = pointsResponse.points;
            // check if possible to wager this amount
            if (currentPoints && wager <= currentPoints) {
              // random number between 0 and 100
              const randomNumber = Math.floor(Math.random() * 101);
              let resultVerb = "";
              if (randomNumber >= 50) {
                resultVerb = "won";
                currentPoints = currentPoints + wager * 2;
              } else {
                resultVerb = "lost";
                currentPoints = currentPoints - wager;
              }
              await pointsModelClient.updatePoints(user, currentPoints);
              chatClient.say(
                channel,
                `@${user} gambled and rolled a ${randomNumber} and ${resultVerb} ${
                  resultVerb === "won" ? wager * 2 : wager
                } points! They now have ${currentPoints} points! 🚀 💎 🙌`
              );
            } else {
              chatClient.say(
                channel,
                `@${user} does not have enough points to gamble. FeelsBadMan`
              );
            }
          }
        } catch (error) {
          chatClient.say(channel, error);
        }
      } else {
        chatClient.say(
          channel,
          `@${user}, invalid input given, please enter a non-zero, positive integer! Invalid: ${tokens[1]}`
        );
      }
    } else {
      chatClient.say(
        channel,
        `@${user}, could not read your wager! Please use the format ${process.env.PREFIX}gamble <wager>`
      );
    }
  }
}
