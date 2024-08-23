import Fastify from "fastify";
import { connectDB } from "./config/connect.js";
import 'dotenv/config'
import { PORT } from "./config/config.js";
import { admin,buildAdminRouter } from "./config/setup.js";


const start = async ()=>{
    await connectDB(process.env.MONGO_URI);
    const app = Fastify();

    await buildAdminRouter(app);
    app.listen({port:PORT || 3000, host: "0.0.0.0"},(err,addr)=>{
        if(err)
            console.log(err);
        else
        console.log(`Server listening at http://localhost:${addr}${admin.options.routePath || "/admin"}`);
    });
}

start();