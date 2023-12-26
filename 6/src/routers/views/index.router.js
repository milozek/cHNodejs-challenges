import { Router } from "express"
import ProductsManager from "../../dao/Dao/product.manager.js"

const router = Router()

router.get("/", (req, res) => {
    res.render("index", { title: "Home" })
})

router.get("/products", async (req, res) => {
    const products = await ProductsManager.get()
    res.render("products", {
        products: products.map((product) => product.toJSON()),
        title: "Products list",
    })
})

router.get("/chat", (req, res) => {
    res.render("chat", { title: "Chat" })
})

export default router
