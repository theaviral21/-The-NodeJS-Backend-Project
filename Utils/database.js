import mongoose from "mongoose";
import dotenv from "dotenv"
import dns from "node:dns"
// force node.js to use google dns servers for srv resolution

 dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8","8.8.4.4"]);
dotenv.config()

const db = () => {
mongoose
.connect(process.env.MONGO_URL)

   .then(() => {
    console.log("connected to mongodb");
   })
   .catch((error) => {
    console.log("error connecting to mongodb:",error.message);
   });
}

export default db;