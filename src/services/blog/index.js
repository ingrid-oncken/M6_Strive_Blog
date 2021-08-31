import express from "express"
import createError from "http-errors"

import BlogModel from "./schema.js"

const blogRouter = express.Router()

blogRouter.post("/", async (req, res, next) => {
  try {
    console.log('here')
    res.send('ok')
    // const newBlog = new BlogModel(req.body) // here happens validation of the req.body, if it's not ok mongoose will throw a "ValidationError"
    // const { _id } = await newBlog.save()

    // res.status(201).send({ _id })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

blogRouter.get("/", async (req, res, next) => {
  try {
    const blog = await BlogModel.find({})

    res.send(blog)
  } catch (error) {
    next(error)
  }
})
blogRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId

    const blog = await BlogModel.findById(blogId) // similar to findOne()

    if (blog) {
      res.send(blog)
    } else {
      next(createError(404, `blog with id ${blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId

    const modifiedBlog = await BlogModel.findByIdAndUpdate(blogId, req.body, {
      new: true, // returns the modified blog
    })

    if (modifiedBlog) {
      res.send(modifiedBlog)
    } else {
      next(createError(404, `blog with id ${blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})
blogRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId

    const deletedBlog = await BlogModel.findByIdAndDelete(blogId)

    if (deletedBlog) {
      res.status(204).send()
    } else {
      next(createError(404, `blog with id ${blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default blogRouter
