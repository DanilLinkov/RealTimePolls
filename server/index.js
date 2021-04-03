import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
import * as io from "socket.io";

import Option from "./models/option.js";
import Poll from "./models/poll.js";

import pollRoutes from "./routes/poll.js";
import optionRoutes from "./routes/option.js";

const app = express();
const httpServer = http.createServer(app);
const socketio = new io.Server(httpServer);

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/poll", pollRoutes);
app.use("/option", optionRoutes);

const CONNECTION_URL = process.env.DB_CONN;
const PORT = process.env.PORT || 3000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    httpServer.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);

socketio.on("connection", (socket) => {
  socket.on("joinPoll", (id) => {
    console.log(`user joined to poll ${id}`);
    socket.join(id);
  });

  socket.on("updatePoll", ({ id, optionId }) => {
    console.log(`user voted for ${optionId}`);

    upvotePost(optionId);

    socket.broadcast.to(id).emit("updatedPoll", { optionId });
  });
});

const upvotePost = async (optionId) => {
  try {
    const option = await Option.findById(optionId);
    option.numberOfVotes++;

    await option.save();
  } catch (e) {
    console.log("failed to upvote option: " + optionId);
  }
};
