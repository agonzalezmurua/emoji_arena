import Express from "express"
require("dotenv").config()

const { SERVER_PORT } = process.env
const app = Express()

app.listen(SERVER_PORT, () => {
  console.log("Server ready listening to port", SERVER_PORT)
})
