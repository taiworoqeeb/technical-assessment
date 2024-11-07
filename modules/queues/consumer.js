const amqp = require('amqplib');
const { logger } = require('../errorLogger');
const { uploadUserDataService } = require('../../services/messageService');


/**
 *
 * @param {amqp.Connection} connection
 */
exports.consumeFromQueue = async (connection) => {

    let channel = await connection.createChannel()

    const queue = "message"
    await channel.assertQueue(queue, { durable: true })
    await channel.prefetch(2)


    try {
          channel.consume(queue, async(msg) => {
                try {
                      if(msg != null) {
                            const content = JSON.parse(String(msg?.content))

                            await uploadUserDataService(content)
                            channel.ack(msg)
                      } else{
                            logger.error("msg-error:", msg)
                            channel.reject(msg, false)
                            return
                      }
                } catch (error) {
                      channel.reject(msg, false)
                     logger.error("unable to process message", error)
                }
          })
    } catch (error) {
          logger.error("unable to consume message", error)
    }

    channel.on("close", () => {
          setTimeout(async() => {
                // Reconnect and restart the consumer
                channel = await connection.createChannel()
          }, 2000)
    })
}
