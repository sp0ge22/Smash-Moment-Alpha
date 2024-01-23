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

// Assuming you have a "quizzes" collection in your database
app.get('/getCount', async (req, res) => {
  try {
    const quizCollection = client.db("smash-db").collection("quizzes");
    const quiz = await quizCollection.findOne({});
    console.log("GET /getCount request successful");
    res.json(quiz ? quiz.correctAnswers : 0);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/incrementCount', async (req, res) => {
  try {
    const result = await Quiz.findOneAndUpdate(
      { questionId: 'specific_question_id' },
      { $inc: { correctAnswers: 1 } },
      { new: true, upsert: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(result.correctAnswers);
  } catch (error) {
    console.error('Error in incrementCount:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3001;

connectToMongoDB().then(() => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});
