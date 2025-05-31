require('dotenv').config();
const express = require("express");
const app = express();
const PORT = parseInt(process.env.PORT || 8000);

//const path = require('path')
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require('morgan');
//const swaggerUi = require("swagger-ui-express");
//const swaggerJsDoc = require("swagger-jsdoc");
const cookieParser = require("cookie-parser");

//const csrf = require('csurf');
//const csrfProtection = csrf({ cookie: true });

require("./config/database");

const userRouter = require('./routes/user.route');
const testRouter = require('./routes/test.route')
const donationApplicationRouter = require('./routes/donationApplication.route');

const corsOptions = {
  origin: [
    process.env.PROTOCOL + '://' + process.env.APPLICATION_DOMAIN,
  ],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'X-CSRF-Token',
        'Accept',
        'Accept-Language',
        'User-Agent',
        'If-Modified-Since'
  ],
  credentials: true
};


app.use(cors(corsOptions));



app.use(morgan('tiny'))
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.PROTOCOL + '://' + process.env.APPLICATION_DOMAIN);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});


app.use("/api/v1/application", donationApplicationRouter)
app.use("/api/v1/user", userRouter);
app.use("/api/v1/test", testRouter);



// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
  });
  
  app.listen(PORT, '0.0.0.0',() => {
    console.log(`Server is listening on port ${PORT}.`);
  });
  