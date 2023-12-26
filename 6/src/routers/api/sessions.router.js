import { Router } from "express"
import UserModel from "../../models/user.model.js"
import passport from "passport"
import { createHash, isValidPassword } from "../../utils.js"

const router = Router()

router.post(
    "/sessions/login",
    passport.authenticate("login", { failureRedirect: "/login" }),
    async (req, res) => res.redirect("/profile")
)

router.post(
    "/sessions/register",
    passport.authenticate("register", { failureRedirect: "/register" }),
    async (req, res) => res.redirect("/login")
)

router.post("/sessions/recovery-password", async (req, res) => {
    const {
        body: { email, password },
    } = req
    if (!email || !password) {
        return res.render("error", {
            title: "Hi",
            messageError: "Every field is required",
        })
    }
    const user = await UserModel.findOne({ email })
    if (!user) {
        return res.render("error", {
            title: "Hi",
            messageError: "email or password are invalid",
        })
    }
    user.password = createHash(password)
    await UserModel.updateOne({ email }, user)
    res.redirect("/login")
})

router.get("/sessions/me", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "you need to sign in first" })
    }
    res.status(200).json(req.session.user)
})

router.get("/session/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.render("error", { title: "Hello ", messageError: error.message })
        }
        res.redirect("/login")
    })
})

router.get("/sessions/github", passport.authenticate("github", { scope: ["user:email"] }))

router.get(
    "/sessions/github/callback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    (req, res) => {
        console.log("req.user", req.user)
        res.redirect("/profile")
    }
)

export default router
