import express from "express"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"

import blogRouter from "./services/blog/index.js"
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
