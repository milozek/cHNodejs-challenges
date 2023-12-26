import express from "express"
import handlebars from "express-handlebars"
import sessions from "express-session"
import passport from "passport"
import path from "path"
import MongoStore from "connect-mongo"

import { __dirname } from "./utils.js"
import { URI } from "./db/mongodb.js"
import { init as initPassport } from "./config/passport.config.js"

import cartsRouter from "./routers/api/products.router.js"
import productsRouter from "./routers/api/products.router.js"
import indexRouter from "./routers/views/index.router.js"
import loginRouter from "./routers/views/login.router.js"
import sessionsRouter from "./routers/api/sessions.router.js"

const app = express()

const SESSION_SECRET = "|7@3BBY5jH:@zFQIg_v47HkKP5S#p&Uc"

app.use(
    sessions({
        store: MongoStore.create({
            mongoUrl: URI,
            mongoOptions: {},
            ttl: 60 * 30,
        }),
        secret: SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
)

/** Express */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(`${__dirname}`, "../public")))

/** Handlebars */
app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`)
app.set("view engine", "handlebars")

/** Passport */
initPassport()
app.use(passport.initialize())
app.use(passport.session())

/** Middlewares */
app.use("/", indexRouter, loginRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/sessions", sessionsRouter)

app.use((error, req, res, next) => {
    const message = `Unknown error ${error.message}`
    console.error(message)
    res.status(500).json({ message })
})

export default app
