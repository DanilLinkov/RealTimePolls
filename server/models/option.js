import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poll",
  },
  name: {
    type: String,
    required: true,
    maxLength: 20,
  },
  numberOfVotes: {
    type: Number,
    default: 0,
  },
});

var Option = mongoose.model("Option", optionSchema);

export default Option;
