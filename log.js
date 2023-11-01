const winston = require("winston");
const { createLogger, format, transports } = require('winston');

const logger = winston.createLogger({
  level: "info",

  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new winston.transports.File({ filename: "./storage/logs/nodejs.log"}),
  ],

});

logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);

function info(message) {
    logger.info(message);
}

function warn(message) {
  logger.warn(message);
}

function error(message) {
  logger.error(message);
}



module.exports={info,warn,error};