const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ServerApiVersion = require('mongodb').ServerApiVersion;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db('wearOS_data');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

app.post('/api/data', express.json(), async (req, res) => {
        const data = req.body;

        if (!data.type || !data.value) {
            return res.status(400).json({ error: 'Invalid data format' });
        }
        try {
            const collection = db.collection('wearable_data');
            const result = await collection.insertOne({
                ...data,
                timestamp: new Date()
            });
            res.status(201).json({ message: 'Data stored successfully', id: result.insertedId });
        } catch (error) {
            console.error('Error storing data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});