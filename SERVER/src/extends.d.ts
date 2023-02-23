export type IAuthPayload = {
    id:string;
    email:string;
    role:string;
}



declare global{
    namespace Express{
        export interface Request{
        user?: IAuthPayload
        }
    }
}