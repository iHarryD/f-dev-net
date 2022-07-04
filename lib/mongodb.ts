import { MongoClient, MongoClientOptions } from "mongodb";

const url = process.env.MONGODB_URL;
const mongodbOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!url)
  throw new Error("Could not find mongodb uri in environment variables.");

// if (process.env.NODE_ENV === "development") {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(url, mongodbOptions);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
client = new MongoClient(url, mongodbOptions as MongoClientOptions);
clientPromise = client.connect();
// }

export default clientPromise;
