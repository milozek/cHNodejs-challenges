import CartModel from "../models/cart.model.js"

export default class CartManager {
    static get() {
        return CartModel.find()
    }
    static async getById(cid) {
        const cart = await CartModel.findById(cid)
        if (!cart) {
            throw new Error("Cart not found.")
        }
        return cart
    }
    static async create(data) {
        const cart = await CartModel.create(data)
        console.log(`Cart created (${cart._id}).`)
        return cart
    }

    static async updateById(cid, data) {
        await CartModel.updateOne({ _id: cid }, { $set: data })
        console.log(`Cart updated (${cid}).`)
    }

    static async deleteById(cid) {
        await CartModel.deleteOne({ _id: cid })
        console.log(`Cart deleted (${cid}).`)
    }
}
