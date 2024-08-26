import { Branch, Customer, DeliveryPartner, Order } from "../../model/index.js";


export const createOrder = async (req,reply)=>{
    try {
        const {userId}=req.user;
        const {items,branch,totalPrice}=req.body;


        const customerData = await Customer.findById(userId);
        const branchData = await Branch.findById(branch);

        if(!customerData){
            return reply.status(404).send({message: "Customer not found."});
        }

        const newOrder = new Order({
            customer: userId,
            items: items.map((item)=>({
                id: item.id,
                item: item.item,
                count: item.count

            })),
            branch,
            totalPrice,
            deliveryLocation:{
                latitude: customerData.liveLocation.latitude,
                longitude: customerData.liveLocation.longitude,
                address: customerData.address || "no address available"
            },
            pickupLocation:{
                latitude: branchData.location.latitude,
                longitude: branchData.location.longitude,
                address: branchData.address || "no address available"
            },
            
        })

        const saveOrder = await newOrder.save();
        return reply.status(201).send({message: "Order created successfully.",order: saveOrder});
        
    } catch (error) {
        return reply.status(500).send({message:"Error creating order",error})
    }
}

export const confirmOrder = async(req,reply)=>{
    try {

        const {orderId}=req.params;
        const {userId}=req.user;
        const {deliveryPersonLocation}=req.body;
        
        const deliveryPartner = await DeliveryPartner.findById(userId);
        if(!deliveryPartner) return reply.status(404).send({message:"delivery person not found"});

        const order = await Order.findById(orderId);
        if(!order) return reply.status(404).send({message:"order not found"});

        if(order.status !== 'avaliable'){
            return reply.status(400).send({message:"order status must be 'avaliable' to accept"});
        }
        order.status="confirmed"

        order.deliveryPartner = userId;
        order.deliveryPersonLocation={
            latitude: deliveryPersonLocation?.latitude,
            longitude: deliveryPersonLocation?.longitude,
            address: deliveryPersonLocation.address || ""
        }
        await order.save();

        return reply.status(200).send(order);

        
    } catch (error) {

        return reply.status(500).send({message:"Failed to confirm Order",error})
        
    }
}
export const updateOrderStatus = async (req,reply)=>{
    try {
        const {orderId}=req.params;
        const {status,deliveryPersonLocation}=req.body;

        const {userId}=req.user;

        const deliveryPartner = await DeliveryPartner.findById(userId);
        if(!deliveryPartner)
            return reply.status(404).send({message:"delivery person not found"});

        const order = await Order.findById(orderId);
        if(!order)
            return reply.status(404).send({message:"order not found"});

        if(['cancelled','delivered'].includes(order.status))
            return reply.status(400).send({message:"order status can't be changed it's cancelled or delivered"});

        if(order.deliveryPartner.toString()!=userId){
            return reply.status(403).send({message:"Unauthorized "});
        }
        order.status=status;
        order.deliveryPersonLocation=deliveryPersonLocation;
        await order.save();
        return reply.status(200).send(order);
    } catch (error) {
        return reply.status(500).send({message:"Failed to update Order status",error})
        
    }
}

export const getOrders = async (req,reply)=>{
    try {
        const {status,customerId,deliveryPartnerId,branchId}=req.query;
        let query={};
        if(status) query.status=status;
        if(customerId) query.customer=customerId;
        if(deliveryPartnerId) query.deliveryPartner=deliveryPartnerId;
        if(branchId) query.branch=branchId;


        const orders = await Order.find(query).populate(
            "customer branch items.item deliveryPartner"
        )
        return reply.status(200).send(orders);

    } catch (error) {
        return reply.status(500).send({message:"Failed to get orders",error})
        
    }
}

export const getOrderById = async (req,reply)=>{
    try {
        const {orderId}=req.params;

        const order = await Order.findById(orderId).populate(
             "customer branch items.item deliveryPartner"
        )
        if(!order){
            reply.status(404).send({message:"Order not found"})
        }
        return reply.status(200).send(order);

    } catch (error) {
        return reply.status(500).send({message:"Failed to get orders",error})
        
    }
}