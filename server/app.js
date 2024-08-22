import Fastify from "fastify";
import { connectDB } from "./config/connect.js";
import 'dotenv/config'


const start = async ()=>{
    await connectDB(process.env.MONGO_URI);
    const app = Fastify();
    app.listen({port:process.env.PORT || 3000, host: "0.0.0.0"},(err,addr)=>{
        if(err)
            console.log(err);
        else
        console.log(`Server listening at http://localhost:${addr}`);
    });
}

start();