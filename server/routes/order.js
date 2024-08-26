import { verifyToken } from "../middleware/auth"


export const orderRouter = async (fastify,options)=>{
    fastify.addHook("prehandler",async (request,reply)=>{
        const isAuthenticated = await verifyToken(request,reply);
        if(!isAuthenticated)
            return reply.status(401).send({message:"Unauthorized"})
    })
}