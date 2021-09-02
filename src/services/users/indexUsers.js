import express from "express"
import createError from "http-errors"

import UserModel from "./schemaUsers.js"
import BlogSchema from "../blog/schemaBlog.js"

const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body) // here happens validation of the req.body, if it's not ok mongoose will throw a "ValidationError"
    const { _id } = await newUser.save()

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find({})

    res.send(users)
  } catch (error) {
    next(error)
  }
})
usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId

    const user = await UserModel.findById(userId) // similar to findOne()

    if (user) {
      res.send(user)
    } else {
      next(createError(404, `User with id ${userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId

    const modifiedUser = await UserModel.findByIdAndUpdate(userId, req.body, {
      new: true, // returns the modified user
    })

    if (modifiedUser) {
      res.send(modifiedUser)
    } else {
      next(createError(404, `User with id ${userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})
usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId

    const deletedUser = await UserModel.findByIdAndDelete(userId)

    if (deletedUser) {
      res.status(204).send()
    } else {
      next(createError(404, `User with id ${userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/:userId/purchaseHistory", async (req, res, next) => {
  try {
    // BookId is received in the req.body. Given this id we want to insert the corresponding book into the purchase history (an array that belongs to the specified user :userId)

    // 1. Find book by id

    const purchasedBook = await BlogSchema.findById(req.body.bookId, { _id: 0 })

    if (purchasedBook) {
      // 2. If the book is found, add additional info to that object like purchaseDate

      const bookToInsert = {
        ...purchasedBook.toObject(),
        purchaseDate: new Date(),
      } // purchasedBook is a DOCUMENT not a normal object, therefore I need to convert it into a JS object to be able to spread it

      // 3. Update the specified user by adding the book to the array

      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.userId, // who you want to modify
        { $push: { purchaseHistory: bookToInsert } }, // how you want to modify him/her
        { new: true } // options
      )
      if (updatedUser) {
        res.send(updatedUser)
      } else {
        next(createError(404, `User with id ${req.params.userId} not found!`))
      }
    } else {
      next(createError(404, `Book with id ${req.body.bookId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:userId/purchaseHistory", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId)

    if (user) {
      res.send(user.purchaseHistory)
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }

    // if(!user) return next(createError(404, `User with id ${req.params.userId} not found!`))
    // res.send()
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:userId/purchaseHistory/:bookId", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId)
    // await UserModel.findOne({_id: req.params.userId, purchaseHistory._id: req.params.bookId})
    if (user) {
      // if (user.purchaseHistory.length > 0) {
      const book = user.purchaseHistory.find(
        (b) => b._id.toString() === req.params.bookId
      )
      if (book) {
        res.send(book)
      } else {
        next(
          createError(
            404,
            `Book with id ${req.params.bookId} not found in purchase history!`
          )
        )
      }
      // } else {
      //   next(createError(404, `Purchase history empty!`))
      // }
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:userId/purchaseHistory/:bookId", async (req, res, next) => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { _id: req.params.userId, "purchaseHistory._id": req.params.bookId },
      {
        $set: {
          "purchaseHistory.$": req.body, // $ is the POSITIONAL OPERATOR, it represents the index of the found book in the purchaseHistory array
        },
      },
      { new: true }
    )

    if (user) {
      res.send(user)
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.delete(
  "/:userId/purchaseHistory/:bookId",
  async (req, res, next) => {
    try {
      const user = await UserModel.findByIdAndUpdate(
        req.params.userId, // who we want to modify
        {
          $pull: {
            // how we want to modify
            purchaseHistory: { _id: req.params.bookId },
          },
        },
        {
          new: true,
        }
      )

      if (user) {
        res.send(user)
      } else {
        next(createError(404, `User with id ${req.params.userId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  }
)

export default usersRouter
