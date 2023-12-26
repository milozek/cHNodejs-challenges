import { Server } from "socket.io"

import MessageModel from "./dao/models/message.model.js"

let io

export const init = (httpServer) => {
    io = new Server(httpServer)

    io.on("connection", async (socket) => {
        console.log(`New client connected (${socket.id})`)
        const conversation = await MessageModel.find({})
        socket.emit("update-conversation", conversation)

        socket.on("new-message", async (msg) => {
            await MessageModel.create(msg)
            const conversation = await MessageModel.find({})
            io.emit("update-conversation", conversation)
        })
    })
}
