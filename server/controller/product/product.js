import { Product } from "../../model/index.js";

export const getProductByCategoryId = async (req, reply) => {
  const { categoryId } = req.params;

  try {
    const product = await Product.find({ category: categoryId })
      .select("-category")
      .exec();

    return reply.send({
      products: product,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};
