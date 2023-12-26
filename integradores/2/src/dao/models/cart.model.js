import mongoose, { Schema } from "mongoose"
import paginator from "mongoose-paginate-v2"

const productItem = new Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
    },
    { _id: false }
)

const cartSchema = new Schema({
    products: { type: [productItem], default: [] },
})

cartSchema.plugin(paginator)

cartSchema.pre("find", function () {
    this.populate("products.product")
})

export default mongoose.model("Cart", cartSchema)
