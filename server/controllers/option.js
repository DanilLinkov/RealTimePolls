import express from "express";
import mongoose from "mongoose";

import Option from "../models/option.js";

const router = express.Router();

export const voteForOption = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No option with id: ${id}`);
  }

  try {
    const option = await Option.findById(id);
    option.numberOfVotes++;

    await option.save();
    res.status(201).json(option);
  } catch (e) {
    res.status(409).json({ message: e.message });
  }
};
