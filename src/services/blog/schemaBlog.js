import mongoose from "mongoose"

const BlogSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    author: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      avatar: { type: String, required: true },
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model("Blog", BlogSchema)
