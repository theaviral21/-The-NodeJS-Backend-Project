import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import database from "./Utils/database.js";
import cookieParser from "cookie-parser";
//import all routes
import userRoutes from "./route/user.route.js"
dotenv.config();
const app = express();
app.use(
    cors({
        origin: process.env.BASE_URL,
        credentials: true,
        methods: ['GET','POST','DELETE','OPTIONS'],
        allowedHeaders: ['content-type','authorization']
    })

);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const port = process.env.PORT||3000;

app.get("/",(req,res) =>{
    res.send("cohort");

});
app.get("/Aviral", (req,res) =>{
    console.log(req.body);
    res.send("Aviral");
});
app.get("/durgesh", (req,res) =>{
    res.send("durgesh");
});

//connect to database
database();

//users routes
app.use("/api/v1/users/", userRoutes)



     const server = app.listen(port,() =>{
    console.log(`Example app listening on port ${port}`);
});
 setInterval(() => {},1000000);