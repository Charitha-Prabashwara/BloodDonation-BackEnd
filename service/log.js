const fs = require('fs');
const path = require('path');
const { getCurrentDateTime } = require('./currentTime');

const logDir = path.join(__dirname, '../logs');
const logFilePath = path.join(logDir, 'application.log');

// Ensure the log directory exists
(async () => {
  try {
    fs.mkdir(logDir, { recursive: true });
    fs.writeFile(logFilePath, '', { flag: 'w' });
  } catch (err) {
    console.error('Error ensuring log file exists:', err.message);
  }
})();


exports.writeLog = async (message) => {
  fs.appendFile(logFilePath, `${getCurrentDateTime()} - ${message}\n`, (err) => {
    if (err) {
      console.error('Error writing to log file:', err.message);
    }
  });
};