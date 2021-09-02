import express from "express"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"
import usersRouter from "./services/users/indexUsers.js"
import authorsRouter from "./services/authors/indexAuthor.js"
import blogRouter from "./services/blog/indexBlog.js"
import {
  badRequestErrorHandler,
  catchAllErrorHandler,
  notFoundErrorHandler,
} from "./errorHandlers.js"

const server = express()

const port = process.env.PORT || 3001

// ******************** MIDDLEWARES ******************

server.use(express.json())

// ******************* ROUTES ***********************

server.use("/blog", blogRouter)
server.use("/users", usersRouter)
server.use("/authors", authorsRouter)

// ******************* ERROR HANDLERS ******************

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(catchAllErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
  console.log("🚀 Successfully connected to mongo!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log("🚂 Server is running on port 🚪", port)
  })
})

mongoose.connection.on("error", (err) => {
  console.log("😐 MONGO ERROR: ", err)
})
