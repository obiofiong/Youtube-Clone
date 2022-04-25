import express from "express";
import cookieParser from "cookie-parser";
import { connectToDatabase, disconnectFromDatabase } from "./utils/database";
import cors from "cors";
import { CORS_ORIGIN } from "./constants";
import helmet from "helmet";
import userRoute from "./modules/user/user.route";
import authRoute from "./modules/auth/auth.route";
import videoRoute from "./modules/videos/video.route";
import deserializeUser from "./middleware/deserializeUser";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(helmet());
app.use(deserializeUser);

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/videos", videoRoute);
const server = app.listen(PORT, async () => {
  await connectToDatabase();
  console.log("server listening on port " + PORT);
});

const signals = ["SIGTERMS", "SIGINT"];

function gracefulShutdown(signal: string) {
  process.on(signal, async () => {
    server.close();

    //disconnect from db
    console.log("my work here is done");
    process.exit(0);
  });
}

for (let i = 0; i < signals.length; i++) {
  gracefulShutdown(signals[i]);
}
