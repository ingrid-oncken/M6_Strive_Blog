import mongoose from 'mongoose'

const { Schema, model } = mongoose

const AuthorSchema = new Schema(
  {
    author: { type: String, required: true },
  },
  { timestamps: true }
)

export default model('Author', AuthorSchema)
// {
//   name: { type: String, required: true },
//   surname: { type: String, required: true },
// },
