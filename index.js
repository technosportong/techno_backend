const express =require('express');
const mongoose=require('mongoose');
const cors = require("cors");

const app=express();
const userRoute=require('./Routes/UserRoute');
const itemsRoute=require('./Routes/ItemsRoute');
const billRoute=require('./Routes/BillRoutes');
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use('/user',userRoute);
app.use('/items',itemsRoute);
app.use('/bill',billRoute);


app.get('/', (req, res) => {
    res.send('Connected to Techno database 🚀');
});

mongoose.connect('mongodb+srv://subramanyamchoda50:jZNpIn2bW5K45yWm@cluster0.hxbjd.mongodb.net/techno')
.then(()=>{
    console.log('connected to database');})
.catch((err)=>{
    console.log(err);
});




app.listen(3000,()=>{
    console.log('server is running on port 3000');
})


