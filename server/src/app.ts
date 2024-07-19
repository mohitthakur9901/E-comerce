import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors());

app.use(express.json({limit:'10mb'}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


import userRoute from "./routes/User.Route"


app.get("/" , (req,res) => {
    res.send("hello")
})

app.use("/api/v1" , userRoute)



export {
    app
}