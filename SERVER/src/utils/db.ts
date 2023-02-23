import mongoose from "mongoose";



export const connect = async() =>{

        const url = "mongodb://0.0.0.0:27017/user"
        await mongoose.connect(url);
    
    }
    
export const  closeDB= async() =>{
    
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }





