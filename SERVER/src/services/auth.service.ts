import bcrypt from "bcrypt";
import jwt, { SignOptions } from 'jsonwebtoken';


const APP_SECRET = 'my-todo-app-secret';
const APP_ACCESS_TOKEN_EXP_SECS = 3600;
const JWT_OPTION:SignOptions ={

    algorithm : "HS256",
    issuer : "mytodoapp.cm/api",
    audience : "mytodoapp.com",
    expiresIn : 3600

}

export function createPasswordHash(password : string){

    return bcrypt.hash(password ,10)
}

export function validatePassword(password : string , hash: string){

    return bcrypt.compare(password,hash);
}
 
type IAuthPayload = {
    id:string;
    email:string;
    role:string;
}

export async function singToken(password:string, hash:string, payloard:IAuthPayload){

    const isValidePassword =  validatePassword(password,hash);
    
    if(!isValidePassword){
        throw new Error("Invalid Password")
    }
    const token = jwt.sign(payloard,APP_SECRET,JWT_OPTION);

    return {
        token,
        life: APP_ACCESS_TOKEN_EXP_SECS
    }

     
}


export function verfyToken(token:string){

    const payload = jwt.verify(token,APP_SECRET,JWT_OPTION);

    return payload as IAuthPayload;
}