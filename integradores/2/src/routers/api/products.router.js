import { Router } from "express"

import passport from "passport"

import ProductModel from "../../dao/models/product.model"

const router = Router()

router.get("/products/me", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const product = await ProductModel.findById(req.product.id)
    res.status(200).json(product)
})

router.get("/products", async (req, res, next) => {
    try {
        const products = await ProductModel.find({})
        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
})

router.get("/products/:pid", async (req, res, next) => {
    try {
        const {
            params: { pid },
        } = req
        const product = await ProductModel.findById(pid)
        if (!product) {
            return res.status(401).json({ message: ` ${pid} not found .` })
        }
        res.status(200).json(product)
    } catch (error) {
        next(error)
    }
})

router.post("/products/", async (req, res, next) => {
    try {
        const { body } = req
        const product = await ProductModel.create(body)
        res.status(201).json(product)
    } catch (error) {
        next(error)
    }
})

router.put("/products/:pid", async (req, res, next) => {
    try {
        const {
            body,
            params: { pid },
        } = req
        await ProductModel.updateOne({ _id: pid }, { $set: body })
        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

router.delete("/products/:pid", async (req, res, next) => {
    try {
        const {
            params: { pid },
        } = req
        await ProductModel.deleteOne({ _id: pid })
        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

export default router
