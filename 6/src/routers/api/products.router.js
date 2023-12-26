import { Router } from "express"
import ProductsManager from "../../dao/Dao/product.manager.js"
import ProductModel from "../../dao/models/product.model.js"
import { buildResponsePaginated } from "../../utils.js"

const router = Router()

router.get("/", async (req, res) => {
    const { limit = 10, page = 1, sort, search } = req.query
    const criteria = {}
    const options = { limit, page }
    if (sort) {
        options.sort = { price: sort }
    }
    if (search) {
        criteria.category = search
    }
    const result = await ProductModel.paginate(criteria, options)
    res.status(200).json(buildResponsePaginated({ ...result, sort, search }))
})

router.get("/:pid", async (req, res) => {
    const { pid } = req.params
    const products = await ProductsManager.getById(pid)
    res.status(200).json(products)
})

router.post("/", async (req, res) => {
    const { body } = req
    const products = await ProductsManager.create(body)
    res.status(201).json(products)
})

router.put("/:pid", async (req, res) => {
    const { pid } = req.params
    const { body } = req
    await ProductsManager.updateById(pid, body)
    res.status(204).end()
})

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params
    await ProductsManager.deleteById(pid)
    res.status(204).end()
})

export default router
