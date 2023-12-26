import http from "http"
import app from "./app.js"

import { init as initMongoDB } from "./db/mongodb.js"
import { init as initSocket } from "./socket.js"

await initMongoDB()

const server = http.createServer(app)
const PORT = 8080

initSocket(server)

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
