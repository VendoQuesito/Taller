const { randomUUID } = require("crypto");
const { Schema, model } = require("mongoose");

const VideoSchema = new Schema(
    {
      id: {
        type: String,
        immutable: true,
        // Random Unique Identifier
        default: () => randomUUID(),
      },
      title: { type: String, required: true },
      description: { type: String, required: true },
      genre: { type: String, required: true },
      available: { type: Boolean, default: true },
    },
  );
  
  const Video = model("Video", VideoSchema);
  
  module.exports = Video;