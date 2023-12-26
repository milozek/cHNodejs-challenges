import express from "express"
import handlebars from "express-handlebars"
import cookieParser from "cookie-parser"
import passport from "passport"
import path from "path"

import indexRouter from "./routers/views/index.router.js"
import productsRouter from "./routers/api/products.router.js"
import cartRouter from "./routers/api/carts.router.js"
import authRouter from "./routers/api/auth.router.js"
import { init as initPassport } from "./config/passport.config.js"
import { __dirname } from "./utils.js"

const app = express()

const COOKIE_SECRET = "qBvPkU2X;J1,51Z!~2p[JW.DT|g:4l@"

app.use(cookieParser(COOKIE_SECRET))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "../public")))
app.engine("handlebars", handlebars.engine())
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "handlebars")

initPassport()
app.use(passport.initialize())

app.use("/", indexRouter)
app.use("/api", authRouter, productsRouter, cartRouter)

app.use((error, req, res, next) => {
    const message = `Unknown error ${error.message}`
    console.log(message)
    res.status(500).json({ status: "error", message })
})

export default app
