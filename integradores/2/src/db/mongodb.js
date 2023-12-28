import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export const URI = process.env.MONGODB_URI
export const init = async () => {
    try {
        await mongoose.connect(URI)
        console.log("Database connected 🚀")
    } catch (error) {
        console.error("Error to connect to database", error.message)
    }
}
