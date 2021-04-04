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
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  options: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Option",
      required: true,
    },
  ],
  isPublic: {
    type: Boolean,
    default: true,
    required: false,
  },
});

var Poll = mongoose.model("Poll", pollSchema);

export default Poll;
