import { parseJsonSourceFileConfigFileContent } from "typescript";
import User from "../models/user.model";
import { createPasswordHash, singToken } from "./auth.service";


export async function findUserByEmail(email:string){
    const existUser = await User.findOne({email})

    return existUser;
}

export async function register (fname:string, lname: string, password: string, email: string, role:string){

    const hash = await createPasswordHash(password)
    const newUser = new User({

        fname,
        lname,
        password :hash,
        email,
        role : "User"

    })

    const userPayload = JSON.parse(JSON.stringify(newUser))

    if(userPayload){
        delete userPayload.password;
    }

    await newUser.save();
    return userPayload
}



export async function login(password:string, email:string){

    const acc = await User.findOne({email})

    if(!acc){

        throw new Error("User Not Found")

    }

    const payload = await singToken(password,acc.password,{
        email: acc.email,
        id: __dirname.toString(),
        role : acc.role
    })

    return payload;
}