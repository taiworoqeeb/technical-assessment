const {Message} = require("../model/message")
const { logger } = require("../modules/errorLogger")

const uploadUserDataService = async (data) => {
    try {
        await Message.create(data, {
            new: true
        })
        logger.info("message inserted successfully")
    } catch (error) {
        logger.error("unable to insert message", error)
    }

}


module.exports = {
    uploadUserDataService
}
