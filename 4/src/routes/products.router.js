import { Router } from "express"
import ProductManager from "../productManager.js"
import { upload } from "../config/multer.js"

const productManager = new ProductManager("products")
const productsRouter = Router()

productsRouter.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
        const products = await productManager.getProducts()
        if (!limit) {
            res.status(200).send({ msg: "Welcome to Router Products!", payload: products })
            return
        }
        const limitedProducts = products.slice(0, limit)
        res.status(200).send({ msg: "Welcome to Router Products!", payload: limitedProducts })
    } catch (e) {
        res.status(502).send({ error: true })
    }
})

productsRouter.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params
        const product = await productManager.getProductById(pid)
        if (!product) {
            res.status(404).send({ error: true, msg: "Not found" })
            return
        }
        res.status(200).send({ payload: product })
    } catch (e) {
        res.status(502).send({ error: true })
    }
})

productsRouter.post("/", upload.single("thumbnail"), async (req, res) => {
    const body = req.body
    const products = await productManager.getProducts()

    if (
        !body.title ||
        !body.description ||
        !body.price ||
        !body.code ||
        !body.status ||
        !body.stock ||
        !body.category
    ) {
        res.status(400).send({ error: true, msg: "Missing content" })
    } else if (products.some((p) => p.code === body.code)) {
        res.status(400).send({ error: true, msg: "Code already exists" })
    } else {
        try {
            const newProduct = await productManager.addProduct(body)
            if (req.file) {
                body.thumbnail = req.file.filename
            }
            res.status(201).send(newProduct)
        } catch (e) {
            console.log(e)
            res.status(502).send({ error: true })
        }
    }
})

productsRouter.put("/:pid", async (req, res) => {
    const products = await productManager.getProducts()
    try {
        const { pid } = req.params
        const product = req.body
        const found = products.find((p) => p.id == pid)
        if (!found) {
            res.status(404).send({ error: true, msg: "Not found 2" })
            return
        }
        const updatedProduct = await productManager.updateProduct(pid, product)
        res.status(200).send({
            msg: "Product updated succesfully",
            update: true,
            payload: updatedProduct,
        })
    } catch (e) {
        res.status(502).send({ error: true })
    }
})

productsRouter.delete("/:pid", async (req, res) => {
    const products = await productManager.getProducts()
    try {
        const { pid } = req.params
        const found = products.find((p) => p.id == pid)
        if (!found) {
            res.status(404).send({ error: true, msg: "Not found" })
            return
        }
        const deletedProduct = await productManager.deleteProduct(pid)
        res.status(200).send({
            msg: "Product deleted succesfully",
            deleted: true,
            payload: deletedProduct,
        })
    } catch (e) {
        res.status(502).send({ error: true })
    }
})

export default productsRouter
