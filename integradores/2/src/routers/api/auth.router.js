import { Router } from "express"

import ProductModel from "../../dao/models/product.model.js"

import { createHash, verifyPassword, createToken } from "../../utils.js"

const router = Router()

router.post("/auth/register", async (req, res) => {
    const {
        body: { first_name, last_name, dni, email, password },
    } = req

    if (!first_name || !last_name || !dni || !email || !password) {
        return res.status(400).json({ message: "All the fields are required" })
    }

    let user = await ProductModel.findOne({ email })

    if (user) {
        return res.status(400).json({ message: "You are registered already" })
    }

    user = await ProductModel.create({
        first_name,
        last_name,
        dni,
        email,
        password: createHash(password),
    })

    res.status(200).json(user)
})

router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(401).json({ message: "Invalid mail or password" })
    }

    const user = await ProductModel.findOne({ email })

    if (!user) {
        return res.status(401).json({ message: "Invalid mail or password" })
    }

    const isNotValidPassword = !verifyPassword(password, user)

    if (isNotValidPassword) {
        return res.status(401).json({ message: "Invalid mail or password" })
    }

    const token = createToken(user)

    res.cookie("access_token", token, { maxAge: 1000 * 60 * 30, httpOnly: true, signed: true })
        .status(200)
        .json({ message: "Success while logging in" })
})

export default router
