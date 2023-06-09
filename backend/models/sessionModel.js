import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  description: {
    type: String,
    default: "",
  },
  tags: {
    type: Array,
  },
  totalTime: {
    type: String,
    required: [true, "Total time not found !"],
  },
  isBillable: {
    type: Boolean,
    default: false,
  },
  startTime: {
    type: String,
    
  },
  endTime: {
    type: String,
    
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
