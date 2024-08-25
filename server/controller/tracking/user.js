//profile update for customer and delivery Partner

import { Customer, DeliveryPartner } from "../../model/index.js";


export const updateUser = async (req,reply)=>{
    try {
        const {userId}=req.user;
        const updateData = req.body;

        let user = await Customer.findOne(userId) || await DeliveryPartner.findOne(userId);

        if(!user){
            return reply.status(404).send({message:"User not found"})
        }

        let UserModel;
        if(user.role=="Customer"){
            UserModel = Customer;
        }
        else if(user.role=="DeliveryPartner"){
            UserModel = DeliveryPartner;
        }
        else {
            return reply.status(400).send({message:"Invalid Role/Token"})
        }

        const updatedUser = await UserModel.findByIdAndUpdate(userId, 
            {$set: updateData},
            {new: true, runValidators:true}
        );

        if(!updatedUser){
            return reply.status(400).send({message:"Invalid data User not found"})
        }

        return reply.send({
            message: "User updated Successfully",
            user: updatedUser,
         
        })

    } catch (error) {
        return reply.status(500).send({message:"An error occured",error});
        
    }
}