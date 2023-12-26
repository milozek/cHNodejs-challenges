import { Router } from "express"
import passport from "passport"
import ProductModel from "../../dao/models/product.model.js"
import { createHash, generateToken } from "../../utils.js"

const router = Router()

router.post(
    "/sessions/login",
    passport.authenticate("login", { failureRedirect: "/login" }),
    async (req, res) => {
        console.log("req.product", req.product)
        const token = generateToken(req.product)
        res.cookie("access_token", token, { maxAge: 1000 * 60 * 30, httpOnly: true }).redirect(
            "/profile"
        )
    }
)

router.post(
    "/sessions/register",
    passport.authenticate("register", { failureRedirect: "/register" }),
    async (req, res) => {
        res.redirect("/login")
    }
)

router.post("/sessions/recovery-password", async (req, res) => {
    const {
        body: { email, password },
    } = req
    if (!email || !password) {
        return res.render("error", {
            title: "Hi",
            messageError: "All the fields are required.",
        })
    }
    const product = await ProductModel.findOne({ email })
    if (!product) {
        return res.render("error", {
            title: "Hi",
            messageError: "Invalid mail or password.",
        })
    }
    product.password = createHash(password)
    await ProductModel.updateOne({ email }, product)
    res.redirect("/login")
})

router.get("/sessions/me", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (!req.product) {
        return res.status(401).json({ message: "You need to authenticate first." })
    }
    res.status(200).json(req.product)
})

router.get("/session/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.render("error", { title: "Hi", messageError: error.message })
        }
        res.redirect("/login")
    })
})

router.get(
    "/sessions/github",
    passport.authenticate("github", { scope: ["product:email"], session: false })
)

router.get(
    "/sessions/github/callback",
    passport.authenticate("github", { session: false, failureRedirect: "/login" }),
    (req, res) => {
        console.log("req.product", req.product)
        const token = generateToken(req.product)
        res.cookie("access_token", token, { maxAge: 1000 * 60 * 30, httpOnly: true }).redirect(
            "/profile"
        )
    }
)

export default router
