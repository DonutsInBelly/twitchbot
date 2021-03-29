import { MongoClient, Collection, Db } from "mongodb";

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}?retryWrites=true&writeConcern=majority`;

type CustomCommand = {
  name: string;
  response: string;
};

export default class CustomCommandsModel {
  private client: MongoClient;
  private dbName = "Commands";
  private collectionName = "custom";
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

  public async addCommand(commandName: string, commandResponse: string) {
    if (this.collectionClient) {
      const initialQuery = await this.collectionClient.find({
        name: commandName,
      });
      if ((await initialQuery.toArray()).length == 0) {
        const custom = {
          name: commandName,
          response: commandResponse,
          count: 0,
        };
        const insertResult = await this.collectionClient.insertOne(custom);
        if (insertResult.insertedCount != 1) {
          throw new Error("Failed to insert command in MongoDB.");
        }
      } else {
        throw new Error("Command already exists, please choose another name.");
      }
    } else {
      throw new Error("Could not connect to collections in MongoDB.");
    }
  }

  public async findCustomCommand(commandName: string) {
    if (this.collectionClient) {
      const results = await this.collectionClient.findOne({
        name: commandName,
      });
      return results;
    } else {
      throw new Error("Could not connect to collections in MongoDB.");
    }
  }
}
