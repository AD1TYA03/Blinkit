import { Category } from "../../model/index.js";


export const getAllCategories =  async (req,reply)=>{
    try {
        const categories = await Category.find();
        return reply.send({
            message: "Categories fetched successfully",
            categories: categories,
        })
    } catch (error) {
        return reply.status(500).send({message:"An error occured",error});
    }
}
