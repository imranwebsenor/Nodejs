require('dotenv').config(); // Load environment variables from .env file

module.exports = {
  port: process.env.PORT || 3000,
  dbConnectionString: process.env.DB_CONNECTION_STRING,
  secretKey: process.env.SECRET_KEY,
  
};