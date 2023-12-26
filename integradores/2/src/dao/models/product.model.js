import mongoose, { Schema } from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new Schema(
    {
        title: { type: String, required: true, index: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, index: true },
        thumbnail: String,
        code: { type: String, required: true, unique: true },
        status: { type: Boolean, default: true },
        stock: { type: Number, required: true },
        category: { type: String, required: true, index: true },
    },
    { timestamps: true }
)

productSchema.plugin(mongoosePaginate)

export default mongoose.model("Product", productSchema)
