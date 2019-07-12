require("dotenv").config()
import Express from "express"
import DiscordClient from "discord_client"
import mongoose from "mongoose";
import Fighter from "models/fighter";

const { SERVER_PORT } = process.env
const app = Express()

app.listen(SERVER_PORT, async () => {
  mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`, { useNewUrlParser: true })
  DiscordClient.on("error", console.error)
  console.log("Server ready listening to port", SERVER_PORT)

  // TODO: create fights
  const fighter = await Fighter
    .find({
      guild: "gremio"
    })
})
