class ProductManager {
    constructor() {
        this.products = []
    }
    getProducts() {
        return this.products
    }
    addProduct = (title, description, price, thumbnail, code, stock) => {
        const product = {
            id: this.products.length == 0 ? 1 : this.products[this.products.length - 1].id + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        }
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return "Every field must be filled"
        }
        if (this.products.some((p) => p.code === code)) {
            console.error("Error: Code already exists")
        } else {
            this.products.push(product)
        }
    }
    getProductById(id) {
        const productSearched = this.products.find((product) => id === product.id)
        if (!productSearched) {
            console.error("Error: Not found")
        } else {
            console.log(productSearched)
        }
    }
}

// tests:

const products = new ProductManager()
console.log(products.getProducts())

products.addProduct("trial product", "this is a trial product", 200, "No image", "abc123", 25)
console.log(products.getProducts())
products.addProduct("trial product", "this is a trial product", 200, "No image", "abc123", 25)
products.addProduct("trial product", "this is a trial product", 200, "No image", "abc125", 25)
console.log(products.getProducts())

console.log(products.getProductById(1))
console.log(products.getProductById(3))
console.log(products.getProductById(2))
