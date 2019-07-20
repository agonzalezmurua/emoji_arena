require("dotenv").config()
const { SERVER_PORT, DB_NAME, NODE_ENV } = process.env
if (NODE_ENV === "production") {
  require("module-alias")
}
import Express from "express"
import client from "./discord_client"
import mongoose from "mongoose"

const app = Express()

app.listen(SERVER_PORT, async () => {
  const collection = NODE_ENV === "production" ? DB_NAME : `${DB_NAME}_dev`
  console.log("Using", collection)
  mongoose.connect(`mongodb://localhost/${collection}`, { useNewUrlParser: true })
  client.on("error", console.error)
  console.log("Server ready listening to port", SERVER_PORT)
})
