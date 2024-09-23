const mongoose=require('mongoose');
const connect = async () =>{
    try {
        // in a React app, environment variables are accessed using the process.env
        await mongoose.connect(process.env.MONGO_URI)
        .then(()=>console.log('connected'));
        console.log('MongoDB Connected');
    }catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
module.exports=connect;