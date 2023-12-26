import fs from "fs/promises"
import { error } from "console"
import { dirname } from "path"
import { fileURLToPath } from "url"
const __dirname = dirname(fileURLToPath(import.meta.url))

export default class CartManager {
    constructor(file) {
        this.carts = []
        this.file = `${__dirname}/db/${file}.json`
        this.path = `${__dirname}/db/products.json`
    }

    #getProductsArray = async () => {
        try {
            const file = await fs.readFile(this.path, "utf-8")
            const products = JSON.parse(file)
            return products
        } catch (e) {
            return error(e)
        }
    }

    async #saveCart(carts) {
        await fs.writeFile(this.file, JSON.stringify(carts))
        this.carts = carts
        return carts
    }

    async #idCalc() {
        const carts = await this.#getCartsArray()
        const id = carts.length == 0 ? 1 : carts[carts.length - 1].id + 1
        return id
    }

    async #getCartsArray() {
        try {
            const file = await fs.readFile(this.file, "utf-8")
            const carts = JSON.parse(file)
            return carts
        } catch (e) {
            await this.#saveCart([])
        }
    }
    async createCart({ productId }) {
        try {
            const productsArray = await this.#getProductsArray()
            const product = productsArray.find((p) => p.id == productId)
            if (!product) return error("Product doesn't exist")

            const products = [{ productId, quantity: 1 }]
            const carts = await this.#getCartsArray()
            const cart = {
                id: await this.#idCalc(),
                products,
            }

            this.carts = carts
            carts.push(cart)
            console.log("A new cart has been created!")
            await this.#saveCart(carts)
            return cart
        } catch (e) {
            await this.#saveCart([])
        }
    }

    async getCartById(cartId) {
        try {
            const carts = await this.#getCartsArray()
            const cart = carts.find((cart) => cart.id == cartId)
            if (!cart) return error("Not found")

            const productsInCart = cart.products

            const productsArray = await this.#getProductsArray()

            const productsDescription = productsArray.filter((product) =>
                cart.products.some((item) => item.productId === product.id)
            )

            return { cartId, productsInCart, productsDescription }
        } catch (e) {
            return error(e)
        }
    }

    async addProductToCart(productId, cartId) {
        try {
            const carts = await this.#getCartsArray()
            const cart = carts.find((c) => cartId == c.id)
            if (!cart) return error("The cart doesn't exist")

            const productsArray = await this.#getProductsArray()
            const product = productsArray.find((p) => p.id == productId)
            if (!product) return error("The product doesn't exist")

            const productIndex = cart.products.findIndex((p) => p.productId == productId)

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1
            } else {
                cart.products.push({ productId, quantity: 1 })
            }
            await this.#saveCart(carts)
            console.log("A new product has been added to the cart!")

            return carts
        } catch (e) {
            return error(e)
        }
    }
}

//tests:

// const carts = new CartManager("carts")

// console.log(await carts.getCartById(5))
// await carts.createCart({productId: 10})
// await carts.addProductToCart(3, 5)
// console.log(await carts.getCartById(5))

// console.log(await carts.getProducts())
