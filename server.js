import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Body parsing middleware

const uri = process.env.DB_URI; // Replace with your MongoDB URI
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

connectToMongoDB(); // Call the function to connect to MongoDB

// Assuming you have a "quizzes" collection in your database
app.get('/getCount', async (req, res) => {
  try {
    const quizCollection = client.db("smash-db").collection("quizzes");
    // Assuming there is only one document and you want to retrieve the correctAnswers field
    const quizDocument = await quizCollection.findOne();

    if (quizDocument) {
      console.log("GET /getCount request successful");
      res.json(quizDocument.correctAnswers); // Send the correctAnswers field
    } else {
      res.status(404).json({ message: "Quiz document not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/incrementCount', async (req, res) => {
  try {
    const quizCollection = client.db("smash-db").collection("quizzes");
    
    // Incrementing the count for all quizzes
    const result = await quizCollection.updateMany({}, { $inc: { correctAnswers: 1 } });

    if (result && result.modifiedCount > 0) {
      res.json("Count incremented successfully");
    } else {
      res.status(404).json({ message: "No quizzes found" });
    }
  } catch (error) {
    console.error('Error in incrementCount:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.listen(433, () => {
  console.log('Server is running on port 433');
});