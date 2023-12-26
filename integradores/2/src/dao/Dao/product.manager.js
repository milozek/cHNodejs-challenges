import ProductModel from "../models/product.model.js"

export default class ProductsManager {
    static get() {
        return ProductModel.find()
    }
    static async getById(pid) {
        const product = await ProductModel.findById(pid)
        if (!product) {
            throw new Error("Product not found.")
        }
        return product
    }
    static async create(data) {
        const product = await ProductModel.create(data)
        console.log(`Product created (${product._id}).`)
        return product
    }

    static async updateById(pid, data) {
        await ProductModel.updateOne({ _id: pid }, { $set: data })
        console.log(`Product updated (${pid}).`)
    }

    static async deleteById(pid) {
        await ProductModel.deleteOne({ _id: pid })
        console.log(`Product deleted (${pid}).`)
    }
}
