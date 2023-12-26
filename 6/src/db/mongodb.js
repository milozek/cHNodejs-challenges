import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export const URI = process.env.MONGODB_URI

export const init = async () => {
    try {
        await mongoose.connect(URI)
        console.log("Database connected successfully")
    } catch (error) {
        console.error("Unexpected error:", error.message)
    }
}
