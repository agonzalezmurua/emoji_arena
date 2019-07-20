require("dotenv").config()
import Express from "express"
import client from "./discord_client"
import mongoose from "mongoose"

const { SERVER_PORT, DB_NAME, DB_DEV_NAME, NODE_ENV } = process.env
const app = Express()

app.listen(SERVER_PORT, async () => {
  const collection = NODE_ENV === "production" ? DB_NAME : DB_DEV_NAME
  console.log("Using", collection)
  mongoose.connect(`mongodb://localhost/${collection}`, { useNewUrlParser: true })
  client.on("error", console.error)
  console.log("Server ready listening to port", SERVER_PORT)
})
