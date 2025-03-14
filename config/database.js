const mongoose = require('mongoose');
const { getCurrentDateTime } = require('../service/currentTime');
const { writeLog } = require('../service/log');
require('dotenv/config')

/**
 * This module connects to the MongoDB database using Mongoose.
 * The connection URI is stored in the environment variable MONO_URI.
 * 
 * Ensure that your .env file contains the following:
 * MONO_URI=mongodb://username:password@host:port/databaseName
 * 
 * Replace 'username', 'password', 'host', 'port', and 'databaseName' with your actual MongoDB credentials and database name.
 */

var isConnectedBefore = false;
  const connect = () => {
    mongoose.connect((process.env.MONO_URI+process.env.MONO_DB), { useNewUrlParser: true, useUnifiedTopology: true})
  }

connect();

mongoose.connection.on('error', async function() {
    //console.log( getCurrentDateTime() +'Could not connect to MongoDB');
    await writeLog('Could not connect to MongoDB');
});

mongoose.connection.on('disconnected', async function(){
    //console.log( getCurrentDateTime() +'Lost MongoDB connection...');
    await writeLog('Lost MongoDB connection...');
    if (!isConnectedBefore)
        connect();
});
mongoose.connection.on('connected', async function() {
    isConnectedBefore = true;
    console.log( getCurrentDateTime() +'Connection established to MongoDB');
    await writeLog('Connection established to MongoDB');

});

mongoose.connection.on('reconnected', async function() {
    //console.log( getCurrentDateTime() +'Reconnecting to MongoDB');
    await writeLog('Reconnecting to MongoDB');
});

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', function() {
    mongoose.connection.close( async function () {
        //console.log( getCurrentDateTime() +'Force to close the MongoDB connection');
        await writeLog('Force to close the MongoDB connection');
        process.exit(0);
    });
});
