import { MongoClient, Db } from 'mongodb';
import 'dotenv/config';

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DATABASE;

let client: MongoClient;
let db: Db;

async function connect() {
    if (uri == undefined) {
        console.error('Undefined uri');
        throw new DatabaseError('Mongo uri is undefined');
    }
    client = new MongoClient(uri);

    try {
        await client.connect();
        db = client.db(dbName);
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database', error);
    }
}

function getDB() {
    return db;
}

export { connect, getDB };
