const express  =  require("express");
const app  =  express();
require("dotenv").config();
const auth  =  require("./routes/authRoutes");
const connectDB =  require("./config/db");
const  PORT  = process.env.PORT||8000

connectDB();
app.use(express.json());


app.get('/', (req, res)=>{
    res.status(200).json({
        stauts:'ok',
        message:"hello world!"
    });
})

app.use('/api',  auth);


app.use((req, res, next)=>{
    const error = new Error("route not  found");
    error.status = 404,
    next(error);
})

// global error  execution  
app.use((err, req, res, next)=>{
    res.status(err.status || 500).json({
      status:"error",
      error:err.message
    });
})


app.listen(PORT, ()=>{
    console.log(`the server is running  on the  port : ${PORT}`);
})