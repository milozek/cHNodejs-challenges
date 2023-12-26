import { Router } from "express"
import ProductManager from "../../dao/Dao/productManager.js"
// import { products } from "../app.js"
const productManager = new ProductManager("products")
const mainRouter = Router()

const products = await productManager.getProducts()

mainRouter.get("/", async (req, res) => {
    res.render("home", {
        payload: products,
        title: "Coder House",
        isAdmin: true,
    })
})

mainRouter.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts", {
        payload: products,
        title: "Coder House",
    })
})

mainRouter.post("/realtimeproducts", async (req, res) => {
    const { body } = req
    if (
        !body.title ||
        !body.description ||
        !body.price ||
        !body.code ||
        !body.stock ||
        !body.category
    ) {
        res.status(400).send({ error: true, msg: "Missing content" })
    } else if (products.some((p) => p.code === body.code)) {
        res.status(400).send({ error: true, msg: "Code already exists" })
    } else {
        try {
            const newProduct = await productManager.addProduct(body)
            res.status(201).send(newProduct)
            req.io.emit("update-products", products)
        } catch (e) {
            console.log(e)
            res.status(502).send({ error: true })
        }
    }
})

export default mainRouter
