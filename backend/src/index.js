const express  =  require("express");
const app  =  express();
require("dotenv").config();
const auth  =  require("./routes/authRoutes");
const note = require("./routes/notesRoutes")
const  PORT  = process.env.PORT||8000
const cookieParser = require("cookie-parser");
const cors  =  require("cors");
const connectDB =  require("./config/db");
connectDB();

app.set("trust proxy", 1);

const allowedOrigins = [
  "https://note-app-roan-five.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res)=>{
    res.status(200).json({
        stauts:'ok',
        message:"hello world!"
    });
})

app.use('/api',  auth);
app.use("/api", note);

app.use((req, res, next)=>{
    const error = new Error("route not  found");
    error.status = 404,
    next(error);
})

  
app.use((err, req, res, next)=>{
    res.status(err.status || 500).json({
      status:"error",
      error:err.message
    });
})


app.listen(PORT, ()=>{
    console.log(`the server is running  on the  port : ${PORT}`);
})