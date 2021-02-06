import fs from "fs/promises";
import { PointModel, UserPoints } from "../model/Points";

export class PointManager {
  private fileName = "points.json";
  private filePath = `${__dirname}/../../${this.fileName}`;
  constructor() {
    // check that file exists in root dir
    fs.readFile(this.filePath).catch(() => {
      fs.writeFile(this.filePath, JSON.stringify({}));
    });
  }

  async getPointModel(): Promise<PointModel> {
    return <PointModel>(
      JSON.parse(await (await fs.readFile(this.filePath)).toString())
    );
  }

  async createNewUser(user: string): Promise<UserPoints> {
    const data = await this.getPointModel();
    const newUser: UserPoints = {
      user: user,
      points: 1000000,
    };
    data.usersWithPoints.push(newUser);
    await fs.writeFile(this.filePath, JSON.stringify(data));
    return newUser;
  }

  async getUserCurrentPoints(user: string): Promise<number> {
    const data: PointModel = await this.getPointModel();
    const userCurrentData = data.usersWithPoints.find((element: UserPoints) => {
      if (element.user === user) {
        return element;
      }
    });
    if (userCurrentData) {
      return userCurrentData.points;
    } else {
      const newUser = await this.createNewUser(user);
      return newUser.points;
    }
  }

  async gamble(
    user: string,
    wager: number
  ): Promise<{ rolled: number; newPoints: number; verb: string }> {
    const data = await this.getPointModel();
    const currentPoints = data.usersWithPoints.find((element) => {
      if (element.user === user) {
        return element;
      }
    });
    // check if possible to wager this amount
    if (currentPoints && wager <= currentPoints?.points) {
      // random number between 0 and 100
      const randomNumber = Math.floor(Math.random() * 101);
      let resultVerb = "";
      if (randomNumber >= 50) {
        resultVerb = "won";
        currentPoints.points = currentPoints.points + wager * 2;
      } else {
        resultVerb = "lost";
        currentPoints.points = currentPoints.points - wager;
      }
      await fs.writeFile(this.filePath, JSON.stringify(data));
      return {
        rolled: randomNumber,
        newPoints: currentPoints.points,
        verb: resultVerb,
      };
    } else if (!currentPoints) {
      await this.createNewUser(user);
      return await this.gamble(user, wager);
    } else {
      throw Error("user does not have enough points to gamble");
    }
  }
}
