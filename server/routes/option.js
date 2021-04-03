import express from "express";
import { voteForOption } from "../controllers/option.js";

const router = express.Router();

router.post("/:id", voteForOption);

export default router;
