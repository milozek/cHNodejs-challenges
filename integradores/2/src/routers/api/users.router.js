import { Router } from "express"

import passport from "passport"

import UserModel from "../../dao/models/user.model.js"

const router = Router()

router.get("/users/me", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const user = await UserModel.findById(req.product.id)
    res.status(200).json(product)
})

router.get("/users", async (req, res, next) => {
    try {
        const users = await UserModel.find({})
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
})

router.get("/users/:uid", async (req, res, next) => {
    try {
        const {
            params: { uid },
        } = req
        const product = await UserModel.findById(uid)
        if (!product) {
            return res.status(401).json({ message: ` ${uid} not found .` })
        }
        res.status(200).json(product)
    } catch (error) {
        next(error)
    }
})

router.post("/users/", async (req, res, next) => {
    try {
        const { body } = req
        const product = await UserModel.create(body)
        res.status(201).json(product)
    } catch (error) {
        next(error)
    }
})

router.put("/users/:uid", async (req, res, next) => {
    try {
        const {
            body,
            params: { uid },
        } = req
        await UserModel.updateOne({ _id: uid }, { $set: body })
        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

router.delete("/users/:uid", async (req, res, next) => {
    try {
        const {
            params: { uid },
        } = req
        await UserModel.deleteOne({ _id: uid })
        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

export default router
