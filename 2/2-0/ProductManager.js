import { error } from "console"
import fs from "fs/promises"

export default class ProductManager {
    constructor(path) {
        this.products = []
        this.path = `./${path}.json`
    }

    async #saveProduct(products) {
        await fs.writeFile(this.path, JSON.stringify(products))
        this.products = products
        return products
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
        const { title, description, price, thumbnail, code, stock } = product

        try {
            const products = await this.getProducts()
            const product = {
                id: products.length == 0 ? 1 : products[products.length - 1].id + 1,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            }
            if (!title || !description || !price || !thumbnail || !code || !stock) {
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
            console.error(e)
        }
    }
    async getProductById(productId) {
        const products = await this.getProducts()
        const product = products.find((product) => product.id == productId)
        if (!product) return "Not found"

        return product
    }
    updateProduct = async (productId, data) => {
        const products = await this.getProducts()
        const index = products.findIndex((product) => product.id === productId)
        if (index === -1) return "Not found"
        products[index] = {
            ...products[index],
            ...data,
        }
        console.log("Product updated successfully!")
        await this.#saveProduct(products)
    }

    deleteProduct = async (productId) => {
        const products = await this.getProducts()
        const productIndex = products.findIndex((product) => product.id === productId)
        if (productIndex === -1) {
            return "Not found"
        }
        products.splice(productIndex, 1)
        for (let i = productIndex; i < products.length; i++) {
            products[i].id--
        }
        console.log("Product deleted successfully!")
        await this.#saveProduct(products)
    }
}

//tests:

const products = new ProductManager("products")

console.log(await products.getProducts())

await products.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
})

console.log(await products.getProducts())
console.log(await products.getProductById(1))
console.log(await products.getProductById(3))

await products.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
})
await products.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc124",
    stock: 25,
})
await products.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc125",
    stock: 25,
})
await products.deleteProduct(1)
await products.updateProduct(1, { title: "updated product" })
