import { Router } from "express"

import passport from "passport"

import CartModel from "../../dao/models/cart.model.js"

import { authMiddleware } from "../../utils.js"

const router = Router()

router.post(
    "/carts",
    passport.authenticate("jwt", { session: false }),
    authMiddleware(["admin"]),
    async (req, res) => {
        const cart = await CartModel.create(req.body)
        res.status(201).json(cart)
    }
)

router.get(
    "/carts/:cid",
    passport.authenticate("jwt", { session: false }),
    authMiddleware(["admin"]),
    async (req, res) => {
        const cart = await CartModel.findById(req.params.cid)
        this.populate("products.product")

        if (!cart) {
            return res.status(404).json({ message: "Not found" })
        }
        res.status(200).json(cart)
    }
)

router.get(
    "/carts/",
    passport.authenticate("jwt", { session: false }),
    authMiddleware(["user", "premium_user", "admin"]),
    async (req, res) => {
        const carts = await CartModel.find({})
        res.status(200).json(carts)
    }
)

export default router
