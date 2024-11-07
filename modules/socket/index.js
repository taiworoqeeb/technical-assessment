const { logger } = require("../errorLogger");
const { publishToQueue } = require("../queues/publisher");
const {Server} = require('socket.io');



/**
 * This function is used to establish a connection with the socketIO server.
 *
 * @param {Server} io - The socketIO server instance.
 *
 * @description
 * This function is used to establish a connection with the socketIO server.
 * It listens for the following events:
 * - connection: Triggered when a new user connects to the server.
 * - send-data: Triggered when a user sends data to the server.
 * - disconnect: Triggered when a user disconnects from the server.
 *
 * @returns {void}
 */
const socketConnection = async (io) =>{
    // global.onlineUsers = new Map();

    // global.io = io

    io.on("connection", (socket) => {
        logger.info("User connected")
        // socket.on("add-user", (username) =>{
        //     onlineUsers.set(username, socket.id);
        //     socket.emit("user-connected", "Connection joined successfully");
        // });

        socket.on("send-data", async(data) => {
            try {
                await publishToQueue("message", JSON.stringify(data))
                socket.emit("data-received", "Data received successfully");
            } catch (error) {
                logger.error(error.message)
            }
        })

        // socket.on("remove-user", (username) =>{
        //     onlineUsers.delete(username);
        // })

        socket.on('disconnect', async () => {
            // onlineUsers.delete(username);
            logger.error("User disconnected")
        })

    })
}


module.exports = {
    socketConnection
}
