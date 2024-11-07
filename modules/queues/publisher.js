const amqp = require('amqplib')
const { logger } = require('../errorLogger')

/**
 *
 * @param {String} queue ["message"]
 * @param {"{username, message}"} msg
 */
exports.publishToQueue = async (queue, msg) => {
      const connection = await amqp.connect(process.env.AMQP_URL)
      const channel = await connection.createChannel()
      try{
            await channel.assertQueue(queue, { durable: true })
            channel.sendToQueue(queue, Buffer.from(msg), { persistent: true })

      }catch (error) {
            logger.error("Error, unable to send to queue: ", error.message)
      }
      finally{
            await channel.close()
            await connection.close()
      }
}
