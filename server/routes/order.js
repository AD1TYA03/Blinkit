import { getOrders , createOrder, updateOrderStatus, confirmOrder, getOrderById } from "../controller/order/order.js";
import { verifyToken } from "../middleware/auth.js"


export const orderRouter = async (fastify,options)=>{
    fastify.addHook("prehandler",async (request,reply)=>{
        const isAuthenticated = await verifyToken(request,reply);
        if(!isAuthenticated)
            return reply.status(401).send({message:"Unauthorized"});

    })

    fastify.post('/order',createOrder);
    fastify.get('/order',getOrders);
    fastify.patch('/order/:orderId/status',updateOrderStatus)
    fastify.post('/order/:orderId/confirm',confirmOrder)
    fastify.get('/order/:orderId',getOrderById)

}