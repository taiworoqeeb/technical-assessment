const { logger } = require("../errorLogger")


function terminate (server, db, options = { coredump: false, timeout: 1000 }) {
      // Exit function
      const exit = code => {
            options.coredump ? process.abort() : process.exit(code)
      }

      return (code, reason) => (err, promise) => {
            if (err && err instanceof Error) {
                  // Log error information, using a proper error library(probably winston)
                  logger.error(err.message, [{error:err.stack}])
            }

            //close db connection
            const dbErrorMessage = code == 0
                  ? "Database connection closed due to app termination"
                  : "Database connection closed due to app crash"
            logger.error(dbErrorMessage)
            // logger.error({reason})
            if(code == 0) {
                  db.close()
            }
            // Attempt a graceful shutdown
            server.close(exit)
            setTimeout(exit, options.timeout).unref()
      }
}
module.exports = terminate
