import { NextFunction, Request, Response } from "express"
import { ValidationChain, validationResult } from "express-validator"
import { verfyToken } from "../services/auth.service";


export const validate = (validation: ValidationChain[]) => {

    return async (req: Request, res:Response, next:NextFunction) => {

        await Promise.all(validation.map((validation) => validation.run(req)));

        const errors = validationResult(req);

        if(errors.isEmpty()){

           return next()
        }


        res.status(400).json({err: errors})
    }

}


export const authGuard = async (req: Request, res:Response, next:NextFunction) => { 

    const authToken = req.headers['authorization'];

    if(!authToken){

        return res.status(400).send({
            err: 'forbineded Rrsources'
        })
    }

    try{

        const payload = await verfyToken(authToken.split('Bearer ')[1]);

        req.user = payload;
        next();

    }catch(err:any){

        res.status(400).send({err:err.message})

    } 

}