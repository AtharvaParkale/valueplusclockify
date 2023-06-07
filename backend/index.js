import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import sessionRoutes from './routes/sessionRoutes.js'

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.stack}`);
  console.log("Shutting down the server due to the uncaught exception ! ");
  process.exit(1);
});

dotenv.config({ path: "./config/config.env" });

//MIDDLEWARES
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(cors());

//ROUTES
app.use("/api/v1", sessionRoutes);

//SERVER CONNECTION
const PORT = process.env.PORT || 6003;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("=================================");
      console.log(`App running on port : ${PORT}`);
      console.log("=================================");
    });
  })
  .catch((error) => console.log(`${error} did not connect`));
