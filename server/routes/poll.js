import express from "express";
import {
  createPoll,
  deletePoll,
  getPoll,
  getPolls,
} from "../controllers/poll.js";

const router = express.Router();

router.get("/", getPolls);
router.get("/:id", getPoll);

router.post("/", createPoll);

router.delete("/:id", deletePoll);

export default router;
