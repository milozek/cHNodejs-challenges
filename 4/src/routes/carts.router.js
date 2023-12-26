import { Router } from "express"
import CartManager from "../cartManager.js"
import { error } from "console"
import ProductManager from "../productManager.js"

const cartsRouter = Router()
const cartManager = new CartManager("carts")
const productManager = new ProductManager("products")

cartsRouter.post("/", async (req, res) => {
    const body = req.body
    try {
        const newCart = await cartManager.createCart(body)
        if (!newCart) res.status(400).send({ error: true, msg: "The product doesn't exist" })
        res.status(201).send({ payload: newCart })
    } catch (e) {
        res.status(502).send({ error: true, msg: "Error by creating the cart!" })
    }
})

cartsRouter.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await cartManager.getCartById(cid)
        console.log("cart", cart)
        if (!cart) {
            res.status(404).send({ error: true, msg: "Not found" })
            return
        }
        res.status(200).send({ payload: cart })
    } catch (e) {
        res.status(502).send({ error: true })
    }
})

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params
        const parsedPid = parseInt(pid)

        const cart = await cartManager.getCartById(cid)
        const product = await productManager.getProductById(parsedPid)

        if (!cart) {
            res.status(400).send({ error: true, msg: "The cart doesn't exist" })
        } else if (!product) {
            res.status(400).send({ error: true, msg: "The product doesn't exist" })
        } else {
            await cartManager.addProductToCart(parsedPid, cid)

            res.status(201).send({
                msg: `The product ${pid} has been added to the cart ${cid}`,
                payload: cart,
            })
        }
    } catch (e) {
        res.status(502).send({
            error: true,
            msg: "Something went wrong.",
        })
    }
})

export default cartsRouter
