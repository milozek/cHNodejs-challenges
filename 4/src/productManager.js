import fs from "fs/promises"
import { error } from "console"
import { dirname } from "path"
import { fileURLToPath } from "url"
const __dirname = dirname(fileURLToPath(import.meta.url))

export default class ProductManager {
    constructor(path) {
        this.products = []
        this.path = `${__dirname}/db/${path}.json`
    }

    async #saveProduct(products) {
        await fs.writeFile(this.path, JSON.stringify(products))
        this.products = products
        return products
    }
    async #idCalc() {
        const products = await this.getProducts()
        const id = products.length == 0 ? 1 : products[products.length - 1].id + 1
        return id
    }

    getProducts = async () => {
        try {
            const file = await fs.readFile(this.path, "utf-8")
            const products = JSON.parse(file)
            return products
        } catch (e) {
            await this.#saveProduct([])
        }
    }

    addProduct = async (product) => {
        const {
            title,
            description,
            price,
            thumbnail = "No image",
            code,
            stock,
            status = true,
            category,
        } = product

        try {
            const products = await this.getProducts()
            const product = {
                id: await this.#idCalc(),
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status,
                category,
            }
            if (!title || !description || !price || !code || !stock || !status || !category) {
                return error("Every field must be filled")
            }
            if (products.some((p) => p.code === code)) {
                return error("Code already exists")
            }

            this.products = products
            products.push(product)
            console.log("A new product has been added!")
            await this.#saveProduct(products)
            return product
        } catch (e) {
            return error(e)
        }
    }
    async getProductById(productId) {
        try {
            const products = await this.getProducts()
            const product = products.find((product) => product.id == productId)
            if (!product) return error("Not found")
            return product
        } catch (e) {
            return error(e)
        }
    }
    updateProduct = async (productId, data) => {
        try {
            const products = await this.getProducts()
            const index = products.findIndex((product) => product.id == productId)
            if (index == -1) return error("Not found")
            products[index] = {
                ...products[index],
                ...data,
            }
            console.log("Product updated successfully!")
            await this.#saveProduct(products)
        } catch (e) {
            return error(e)
        }
    }

    deleteProduct = async (productId) => {
        try {
            const products = await this.getProducts()
            const productIndex = products.findIndex((product) => product.id == productId)
            if (productIndex == -1) {
                return error("Not found")
            }
            products.splice(productIndex, 1)
            for (let i = productIndex; i < products.length; i++) {
                products[i].id--
            }
            console.log("Product deleted successfully!")
            await this.#saveProduct(products)
        } catch (e) {
            return error(e)
        }
    }
}

//tests:

/*
const products = new ProductManager("products")

console.log(await products.getProducts())
console.log(await products.getProductById(1))
await products.deleteProduct(1)
await products.updateProduct(1, { title: "updated product" })

await products.addProduct({
    title: "trial product",
    description: "This is a trial product",
    price: 200,
    thumbnail: "No image",
    code: "abc185",
    stock: 25,
    status: true,
    category: "Vegan & Gluten Free"
})
*/
