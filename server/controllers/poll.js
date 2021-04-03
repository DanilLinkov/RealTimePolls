import express from "express";
import mongoose from "mongoose";

import Option from "../models/option.js";
import Poll from "../models/poll.js";

const router = express.Router();

export const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().populate("options");

    res.status(200).json(polls);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const createPoll = async (req, res) => {
  const { title, description, options } = req.body;

  const newPoll = new Poll({
    title,
    description,
  });

  if (!options || options.size <= 0) {
    return res.status(409).send(`No options were provided.`);
  }

  try {
    for (let i = 0; i < options.length; i++) {
      const newOption = new Option({
        pollId: newPoll.id,
        name: options[i],
        numberOfVotes: 0,
      });

      await newOption.save();

      newPoll.options.push(newOption);
    }

    await newPoll.save();

    res.status(201).json(newPoll);
  } catch (e) {
    res.status(409).json({ message: e.message });
  }
};

export const getPoll = async (req, res) => {
  const { id } = req.params;

  try {
    const poll = await Poll.findById(id).populate("options");

    res.status(200).json(poll);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const deletePoll = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No poll wtih id: ${id}`);
  }

  await Poll.findByIdAndRemove(id);

  res.json({ message: "The poll has been deleted successfully." });
};

// export const updatePoll = async (req, res) => {
//   const { id } = req.params;
//   const { title, description, options, locked } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).send(`No poll with id: ${id}`);
//   }

//   const poll = await (await Poll.findById(id)).populated("options");

//   for (let i = 0; i < options.size; i++) {
//     const newOption = new Option({
//       pollId: newPoll.id,
//       name: options[i].name,
//       numberOfVotes: 0,
//     });

//     await newOption.save();

//     newPoll.options.push(newOption);
//   }

// //   const updatePoll = { title, description, options, locked };

// //   await Poll.findByIdAndUpdate(id, updatePoll);

//   res.json(updatePoll);
// };

export default router;
