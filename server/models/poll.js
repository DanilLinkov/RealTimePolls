import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 20,
  },
  description: {
    type: String,
    required: false,
  },
  options: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Option",
      required: true,
    },
  ],
  locked: {
    type: Boolean,
    default: false,
    required: false,
  },
});

var Poll = mongoose.model("Poll", pollSchema);

export default Poll;
