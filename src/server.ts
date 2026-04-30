import app from ".";
import { prisma } from "./lib/prisma";
import dotenv from "dotenv";

dotenv.config();


const PORT = process.env.PORT || 5000;

async function main() {
    try {
        await prisma.$connect();
        console.log("Database connected successfully.");

        // Start your server or application logic here

        app.get('/', (req,res)=>{
            res.send("Hello World");
        })

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    }   catch (error) {
        console.error("Error starting the server:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();