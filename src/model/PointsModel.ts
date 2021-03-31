import { MongoClient, Collection } from "mongodb";
import { PointModel, UserPoints } from "./Points";

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}?retryWrites=true&writeConcern=majority`;

export default class PointsModel {
  private client: MongoClient;
  private dbName = "Points";
  private collectionName = "userPoints";
  private collectionClient: Collection | undefined;

  constructor() {
    this.client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  public async connect() {
    await this.client.connect();
    const dbClient = await this.client.db(this.dbName);
    this.collectionClient = dbClient.collection(this.collectionName);
  }

  public async addUser(user: string) {
    if (this.collectionClient) {
      const defaultPoints = process.env.DEFAULT_POINTS_VALUE || "9999";
      const userToInsert: UserPoints = {
        user: user,
        points: parseInt(defaultPoints),
      };
      await this.collectionClient.insertOne(userToInsert);
      return userToInsert;
    }
    throw new Error("Error: MongoDB Collection Client is null!");
  }

  public async getPoints(user: string): Promise<UserPoints> {
    if (this.collectionClient) {
      const initialQuery = await this.collectionClient.findOne({ user: user });

      if (initialQuery) {
        return initialQuery;
      } else {
        return await this.addUser(user);
      }
    }
    throw new Error("Error: MongoDB Collection Client is null!");
  }

  public async updatePoints(user: string, points: number): Promise<UserPoints> {
    if (this.collectionClient) {
      const initialQuery = await this.collectionClient.findOne({ user: user });

      if (initialQuery) {
        initialQuery.points = points;
        await this.collectionClient.updateOne(
          { user: user },
          { $set: initialQuery }
        );
        return initialQuery;
      } else {
        return await this.addUser(user);
      }
    }
    throw new Error("Error: MongoDB Collection Client is null!");
  }
}
