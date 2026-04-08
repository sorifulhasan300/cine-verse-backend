import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("CineVerse Server is Running! 🚀");
});

app.listen(PORT, () => {
  console.log(`Server is purring on port ${PORT}`);
});
