const socket = io()

const form = document.getElementById("form-product")

form.addEventListener("submit", (event) => {
    event.preventDefault()
    const formData = new FormData(form)
    const formObject = {}

    const newProduct = {
        body: formData.forEach((value, key) => {
            formObject[key] = value
        }),
    }
    console.log(newProduct)
    socket.emit("newProduct", newProduct)
    form.querySelectorAll("input").forEach((input) => {
        input.value = ""
    })
})

socket.on("update-products", (products) => {
    console.log("products", products)
    const logProducts = document.getElementById("log-products")
    logProducts.innerText = ""
    products.forEach((product) => {
        const p = document.createElement("p")
        p.innerText = `${product.body}`
        logProducts.appendChild(p)
    })
})
