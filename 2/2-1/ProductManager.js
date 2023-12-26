import { error } from "console"
import fs from "fs"

export default class ProductManager {
    constructor(path) {
        this.products = []
        this.path = `./${path}.json`
    }
    getProducts = async () => {
        try {
            const file = await fs.promises.readFile(this.path, "utf-8")
            this.products = JSON.parse(file)
            return this.products
        } catch (e) {
            await fs.promises.writeFile(this.path, JSON.stringify([]))
            console.log("A new file has been created!")
            return []
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        try {
            const file = await fs.promises.readFile(this.path, "utf-8")
            const products = JSON.parse(file)
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
            await fs.promises.writeFile(this.path, JSON.stringify(products))
            console.log("A new product has been added to the list!")
            return product
        } catch (error) {
            return error
        }
    }
    getProductById = (productId) => {
        const searchedProduct = this.products.find((product) => productId === product.id)
        if (!searchedProduct) {
            return "Not found"
        }

        return searchedProduct
    }

    updateProduct = async (productId, data) => {
        try {
            const { title, description, price, thumbnail, code, stock } = data
            const products = await getJsonFromFile(this.path)
            const index = products.findIndex((product) => product.id === productId)

            if (index === -1) {
                return "Not found"
            }
            if (title) products[index].title = title
            if (description) products[index].description = description
            if (price) products[index].price = price
            if (thumbnail) products[index].thumbnail = thumbnail
            if (code) products[index].code = code
            if (stock) products[index].stock = stock

            await saveJsonInFile(this.path, products)
            console.log("Product updated successfully")
        } catch (error) {
            return "An error occurred"
        }
    }

    deleteProduct = async (productId) => {
        try {
            const products = await getJsonFromFile(this.path)
            const productIndex = products.findIndex((product) => product.id === productId)

            if (productIndex === -1) {
                return "Not found"
            }

            products.splice(productIndex, 1)

            for (let i = productIndex; i < products.length; i++) {
                products[i].id--
            }

            await saveJsonInFile(this.path, products)
            console.log("Product deleted successfully")
        } catch (error) {
            console.error(error)
            return "An error occurred"
        }
    }
}

const getJsonFromFile = async (path) => {
    if (!fs.existsSync(path)) {
        return []
    }
    const content = await fs.promises.readFile(path, "utf-8")
    return JSON.parse(content)
}

const saveJsonInFile = (path, data) => {
    const content = JSON.stringify(data, null, "\t")
    return fs.promises.writeFile(path, content, "utf-8")
}

//tests:

const products = new ProductManager("products")

console.log(await products.getProducts())

await products.addProduct(
    "producto prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc123",
    25
)
console.log(await products.getProducts())
console.log(await products.getProductById(1))
console.log(await products.getProductById(3))

await products.addProduct(
    "producto prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc123",
    25
)
await products.addProduct(
    "producto prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc124",
    25
)
await products.addProduct(
    "producto prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc125",
    25
)
await products.deleteProduct(1)
await products.updateProduct(1, { title: "updated product" })
