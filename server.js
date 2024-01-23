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
    const quiz = await quizCollection.findOne({ questionId: 'specific_question_id' });
    console.log("GET /getCount request successful");
    res.json(quiz ? quiz.correctAnswers : 0);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/incrementCount', async (req, res) => {
  try {
    const quizCollection = client.db("smash-db").collection("quizzes");
    const result = await quizCollection.findOneAndUpdate(
      { questionId: 'specific_question_id' },
      { $inc: { correctAnswers: 1 } },
      { returnDocument: 'after', upsert: true }
    );

    if (result && result.value) {
      res.json(result.value.correctAnswers);
    } else {
      res.status(404).json({ message: "Document not found" });
    }
  } catch (error) {
    console.error('Error in incrementCount:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});