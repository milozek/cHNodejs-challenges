import { Router } from "express"
import CartManager from "../../dao/Dao/cart.manager.js"

const router = Router()

router.post("/", async (req, res) => {
    const { body } = req
    const carts = await CartManager.create(body)
    res.status(201).json(carts)
})

router.get("/:cid", async (req, res) => {
    const { cid } = req.params
    const carts = await CartManager.getById(cid)
    res.status(200).json(carts)
})

router.post("/:cid/product/:pid", async (req, res) => {})

router.delete("/:cid/products/:pid", async (req, res) => {
    const { cid } = req.params
    await CartManager.deleteById(cid)
    res.status(204).end()
})

router.put("/:cid", async (req, res) => {
    const { cid } = req.params
    const { body } = req
    await CartManager.updateById(cid, body)
    res.status(204).end()
})

router.delete("/:cid", async (req, res) => {
    const { cid } = req.params
    await CartManager.deleteById(cid)
    res.status(204).end()
})

export default router
