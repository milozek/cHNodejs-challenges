import express from "express"
import handlebars from "express-handlebars"

import { Server as HTTPServer } from "http"
import { Server as SocketIO } from "socket.io"

import mainRouter from "./routers/views/main.views.router.js"
import productsRouter from "./routers/api/products.api.router.js"
import cartsRouter from "./routers/api/carts.api.router.js"

import { __dirname } from "./utils.js"

import ProductManager from "./dao/Dao/productManager.js"
const productManager = new ProductManager("products")

const app = express()
const PORT = 8080

app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`)
app.set("view engine", "handlebars")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`))
app.use(express.static(`${__dirname}/db`))

const httpServer = HTTPServer(app)
const io = new SocketIO(httpServer)

app.use((req, res, next) => {
    req.io = io
    next()
})

app.use((error, req, res, next) => {
    const message = `Unknown error ${error.message}`
    console.error(message)
    res.status(500).json({ message })
})

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", mainRouter)

const conversation = [
    {
        username: "coderhouse",
        body: "Hola a la comunidad de CH 🖐️.",
    },
]

io.on("connection", (socket) => {
    console.log(`New client connected, ID ${socket.id}`)
})

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
