import { DeliveryPartner, Customer } from "../../model/index.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const generateToken = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  //if access token is lost we use refresh token to generate access token
  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  return { accessToken, refreshToken };
};

export const loginCustomer = async (req, reply) => {
  try {
    const { phone } = req.body;
    const customer = await Customer.findOne({ phone: phone });

    if (!customer) {
      customer = new Customer({
        phone: phone,
        role: "Customer",
        isActivated: true,
      });
      await customer.save();
    }

    const { accessToken, refreshToken } = generateToken(customer);

    return reply.send({ 
        message: customer?"Login Successful":" Customer created and logged in successfully",
        accessToken: accessToken,
        refreshToken: refreshToken,
        customer: customer,
    });
  } catch (error) {
    console.log(error);
    return reply.status(500).send({message:"an error occured"})

  }
};


export const loginDeliveryPartner = async (req, reply) => {
    try {
      const { email , password} = req.body;
      let deliveryPartner = await DeliveryPartner.findOne({ email });
  
      if (!deliveryPartner) {
        return reply.status(404).send({message:"Delivery Partner not found"})
      }

      const isMatch = password ==  deliveryPartner.password;
      if (!isMatch) {
        return reply.status(401).send({message:"Invalid Password"})
      }
  
      const { accessToken, refreshToken } = generateToken(deliveryPartner);
  
      return reply.send({ 
          message: "Login Successful",
          accessToken: accessToken,
          refreshToken: refreshToken,
          deliveryPartner: deliveryPartner,
      });
    } catch (error) {
      console.log(error);
      return reply.status(500).send({message:"an error occured"})
  
    }
  };



  export const refreshToken = async (req, reply) => {
    const {refreshToken} = req.body;
    if(!refreshToken){
        return reply.status(401).send({message:"Refresh Token is required"})
    }

    try {
        const decode = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        let user;

        if(decode.role === "Customer"){
            user = await Customer.findById(decode.userId);
        }
        else if(decode.role === "DeliveryPartner"){
            user = await DeliveryPartner.findById(decode.userId);
        }
        else {
            return reply.status(403).send({message:"Invalid Role/Token"})
        }

        if(!user){
            return reply.status(404).send({message:"User not found , Invalid Refresh Token"})
        }

       if(user.isActivated){
        const {accessToken, refreshToken:newRefreshToken } = generateToken(user);
        return reply.send({ 
            message: "Refresheshed Token Successful",
            accessToken: accessToken,
            refreshToken: newRefreshToken,
        });

       }
       else{
        return reply.status(403).send({message:"User is not activated"})
       }
       
    } catch (error) {
        return reply.status(403).send({message:"Invalid Refresh Token"})
    }
  }


  export const fetchUser = async (req,reply)=>{
    try {
        const {userId,role}=req.user;
        let user;

        if(role === "Customer"){
            user = await Customer.findById(userId);
        }
        else if(role === "DeliveryPartner"){
            user = await DeliveryPartner.findById(userId);
        }
        else {
            return reply.status(403).send({message:"Invalid Role/Token"})
        }

        if(!user){
            return reply.status(404).send({message:"User not found"})
        }

        return reply.send({
            message: " User Fetched Successfully",
            user: user,
         
        })
        
    } catch (error) {
        return reply.status(500).send({message:"An error occured",error});
    }
  }


  