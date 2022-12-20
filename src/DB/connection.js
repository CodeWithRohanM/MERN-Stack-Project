const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const URI = "mongodb://localhost:27017/UserDetails";

mongoose.connect(URI)
.then(()=>{
    console.log("Database Connection Successfull..");
})
.catch((err)=>{
    console.log(err);
});

