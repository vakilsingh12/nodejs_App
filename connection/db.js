const mongoose=require('mongoose')
// mongoose.connect('mongodb://127.0.0.1:27017/usertest').then(res=>{
mongoose.connect(process.env.MONGO_URL).then(res=>{
    console.log("DB connected successfully");
}).catch(err=>{
    console.log(`error white handling database`)
})