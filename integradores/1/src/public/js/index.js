let user;

const form = document.getElementById("form-message");
const messageInput = document.getElementById("input-message");

const socket = io();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newMessage = {
    user,
    message: messageInput.value,
  };
  socket.emit("new-message", newMessage);

  messageInput.value = "";
  messageInput.focus();
});

// socket.on("update-conversation", (conversation) => {
//     console.log("conversation", conversation)
//     const logMessages = document.getElementById("log-messages")
//     logMessages.innerText = ""
//     conversation.forEach((message) => {
//         const p = document.createElement("p")
//         p.innerText = `${message.user}: ${message.body}`
//         logMessages.appendChild(p)
//     })
// })

Swal.fire({
  title: "Enter your email",
  input: "text",
  allowOutsideClick: false,
  inputValidator: (value) => {
    if (!value) {
      return "Add your email.";
    }
  },
})
  .then((result) => {
    user = result.value.trim();
    console.log("user", user);
  })
  .catch((error) => {
    console.error("Unexpected error:", error.message);
  });
