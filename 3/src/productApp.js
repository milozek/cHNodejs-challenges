import express from "express"
import ProductManager from "./productManager.js"

const productManager = new ProductManager("products")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Welcome to the first Express test!")
})

// * GET ALL
app.get("/api/products", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
        const products = await productManager.getProducts()
        if (!limit) {
            res.status(200).send(products)
            return
        }
        const limitedProducts = products.slice(0, limit)
        res.status(200).send(limitedProducts)
    } catch (e) {
        res.status(502).send({ error: true })
    }
})

// * GET BY ID

app.get("/api/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params
        const product = await productManager.getProductById(pid)
        if (!product) {
            res.status(404).send({ error: true, msg: "The product doesn't exist" })
            return
        }
        res.status(200).send(product)
    } catch (e) {
        res.status(502).send({ error: true })
    }
})

app.listen(8080, () => {
    console.log("listening on port 8080!")
})
