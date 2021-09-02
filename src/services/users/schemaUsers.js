import mongoose from "mongoose"

const { Schema, model } = mongoose

const userSchema = new Schema(
  {
    user: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
      rate: {
        type: Number,
        required: true,
        min: [1, "the minimum possible rate is 1"],
        máx: [5, "the maximum possible rate is 5"],
      },

      required: true,
    },
    comments: [
      {
        comment: { type: String, required: true },
        commentData: Date, //try this
      },
    ],
  },
  { timestamps: true }
)

export default model("User", userSchema)
