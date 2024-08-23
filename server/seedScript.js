import mongoose from "mongoose";
import "dotenv/config";
import { Category, Product, Customer, Admin } from "./model/index.js";
import { categories, products } from "./seedData.js";

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Category.deleteMany({});

    const categoryDocs = await Category.insertMany(categories);
    const categoryMap = categoryDocs.reduce((map, category) => {
      map[category.name] = category._id; // Fixed here
      return map;
    },{});

    const productWithCategoryIds = products.map((product) => ({
        ...product,
        category: categoryMap[product.category],
    }));

    await Product.insertMany(productWithCategoryIds);

    console.log("Database seeded successfully");
  } catch (e) {
    console.error("Error seeding database", e);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
