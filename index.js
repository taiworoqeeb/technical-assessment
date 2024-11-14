const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const {sequelize} = require('./config/database');
const path = require('path');
const {Server} = require('socket.io');
const morgan = require('morgan');
const { myStream, logger } = require('./modules/errorLogger');
const terminate = require('./modules/errorHandler');
const { socketConnection } = require('./modules/socket');
const initializeConsumers = require('./modules/queues/setup');
const {createServer} = require('http')
const app = express();
const server = createServer(app)
require('dotenv').config();

sequelize.authenticate().then(() => {
    logger.info('Database connected')
}).catch((err) => {
    logger.error('Error: ' + err)
})

sequelize.sync();

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})

socketConnection(io)
initializeConsumers()
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));

app.use(morgan(":remote-addr :method :url :status :res[content-length] - :response-time ms", {stream: myStream} ));
app.use(cors({
    origin: '*',
}));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.render('base/index');
})









const port = process.env.PORT || 3000

server.listen(port, () => {
    logger.info(`Listening on port ${port}`);
});

const errorHandler = terminate(server, sequelize)

process.on('uncaughtException', errorHandler(1, 'Unexpected Error'))    //programmer error
process.on('unhandledRejection', errorHandler(1, 'Unhandled Promise'))  //unhandled promise error
process.on('SIGTERM', errorHandler(0, 'SIGTERM'))   //on a successful termination
process.on('SIGINT', errorHandler(0, 'SIGINT')) //interrupted process
