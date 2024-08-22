import mongoose from "mongoose";


const branchSchema = new mongoose.Schema({
    name: { type: String },
    location: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
      address: { typeof: String },
 
      // Assuming one-to-many relationship with Delivery Partners
      // Each Branch can have multiple delivery partners associated with it.
      // This is a simple way to represent a one-to-many relationship.
      // In a real-world application, you would likely have a separate schema for Delivery Partners.
    deliveryPartners:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPartner",

    }]
  });

 const Branch = mongoose.model('Branch',branchSchema)

 export default Branch;