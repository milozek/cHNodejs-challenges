import { Router } from "express"

const router = Router()

router.get("/profile", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login")
    }
    res.render("profile", { title: "Hello ", user: req.session.user })
})

router.get("/login", (req, res) => {
    res.render("login", { title: "Hello " })
})

router.get("/register", (req, res) => {
    res.render("register", { title: "Hello " })
})

router.get("/recovery-password", (req, res) => {
    res.render("recovery-password", { title: "Hello " })
})

export default router
