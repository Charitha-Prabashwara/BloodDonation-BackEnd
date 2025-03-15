const express = require("express");
const app = express();
const PORT = parseInt(process.env.PORT || 8000);

//const path = require('path')
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require('morgan');
//const swaggerUi = require("swagger-ui-express");
//const swaggerJsDoc = require("swagger-jsdoc");
const cookieParser = require("cookie-parser")

require("./config/database");

const userRouter = require('./routes/user.route');


const allowedOrigins = [
  "http://localhost:3000"
];

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "authorization",
    "X-Token" 
  ],
  credentials: true,
};

app.use(cors(corsOptions));



app.use(morgan('tiny'))
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

app.use("/api/v1/user", userRouter);



// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
  });
  
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
  });
  