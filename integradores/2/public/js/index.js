;(function () {
    let email = ""
    const socket = io()

    document.getElementById("form-message").addEventListener("submit", (event) => {
        event.preventDefault()
        const input = document.getElementById("input-message")
        const newMsg = {
            user: email,
            body: input.value,
        }
        input.value = ""
        input.focus()
        socket.emit("new-message", newMsg)
    })

    socket.on("update-conversation", (conversation) => {
        console.log("conversation", conversation)
        const logMessages = document.getElementById("log-messages")
        logMessages.innerText = ""
        conversation.forEach((message) => {
            const p = document.createElement("p")
            p.innerText = `${message.user}: ${message.body}`
            logMessages.appendChild(p)
        })
    })

    Swal.fire({
        title: "Enter your email",
        input: "email",
        inputLabel: "e@mail.com",
        allowOutsideClick: false,
        inputValidator: (value) => {
            if (!value) {
                return "Please enter your email to continue"
            }
        },
    }).then((result) => {
        email = result.value.trim()
        console.log(`Greetings ${email}, welcome`)
    })
})()
