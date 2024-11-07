

// Connect to the server via Socket.IO
const socket = io({
    transports: ["websocket"],
});


// Handle form submission
function sendData() {
  document
    .getElementById("dataForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Capture the input values
      const username = document.getElementById("username").value;
      const data = document.getElementById("data").value;

      // Send data every 5 minutes (300,000 milliseconds)
      setInterval(() => {
        socket.emit("send-data", { username, data });
      }, 300000);

      // Send data to the server via Socket.IO
      socket.emit("send-data", { username, data });

      // Update status
      document.getElementById("status").innerText = "Data sent!";
    });
}


sendData();

// Listen for acknowledgment from the server
socket.on("data-received", (message) => {
  document.getElementById("status").innerText = message;
});

// Handle connection events
socket.on("connect", () => {
  console.log("Connected to the server");
  document.getElementById("status").innerText = "Connected to the server.";
});

socket.on("disconnect", () => {
  console.log("Disconnected from the server");
  document.getElementById("status").innerText = "Disconnected from the server.";
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
  document.getElementById("status").innerText =
    "Connection error. Check console for details.";
});
