import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let db;

async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db('confessionbox');
    }
    return db;
}

async function storeMessage(message) {
    const database = await connectDB();
    const collection = database.collection('messages');
    
    const result = await collection.insertOne({
        content: message,
        createdAt: new Date(),
    });
    
    return result.insertedId;
}

async function getMessages(limit = 50) {
    const database = await connectDB();
    const collection = database.collection('messages');
    
    return await collection.find().sort({ createdAt: -1 }).limit(limit).toArray();
}

async function closeDB() {
    if (client) {
        await client.close();
    }
}

export { connectDB, storeMessage, getMessages, closeDB };