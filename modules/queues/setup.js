const amqp = require("amqplib");
const { logger } = require("../errorLogger");
const { consumeFromQueue } = require("./consumer");



async function connectToRabbitMQ() {
    const maxRetries = 3;
    let currentRetry = 0;
    let connection;


    while (currentRetry < maxRetries) {
        try {
            connection = await amqp.connect(process.env.AMQP_URL);
            logger.info('Successfully connected to RabbitMQ');
            break; // Exit the loop if connection is successful
        } catch (error) {
            currentRetry++;
            logger.error(`Connection attempt failed. Retrying (${currentRetry}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, 5000)); // Retry after a delay
        }
    }

    if (!connection) {
        logger.error('Failed to establish a connection to RabbitMQ after multiple attempts.');
    }

    return connection;

}

async function initializeConsumers() {

    let connection

    try {

        connection = await connectToRabbitMQ()

        await Promise.all([
            consumeFromQueue(connection),
        ])

    } catch (error) {
        logger.error("Error during consumer initialization ", error.message)
    }

}

module.exports = initializeConsumers
