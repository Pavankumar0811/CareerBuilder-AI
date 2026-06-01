import mongoose from "mongoose";

let mongoServerInstance = null;
const projectName = 'career_builder';

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", ()=>{console.log("Database connected successfully..!")});

        let mongodbURI = process.env.MONGODB_URI;
        let connectUri = null;

        if (!mongodbURI) {
            // If no URI provided, fall back to in-memory MongoDB for development
            if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
                console.log("No MONGODB_URI found — starting in-memory MongoDB for development...");
                const { MongoMemoryServer } = await import('mongodb-memory-server');
                const mongod = await MongoMemoryServer.create();
                mongoServerInstance = mongod;
                connectUri = mongod.getUri(projectName);
            } else {
                throw new Error("MONGODB_URI environment variable not set")
            }
        } else {
            if(mongodbURI.endsWith('/')) {
                mongodbURI = mongodbURI.slice(0, -1)
            }
            connectUri = `${mongodbURI}/${projectName}`;
        }

        await mongoose.connect(connectUri, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
    } catch (error) {
       console.error("Error connecting to MongoDB:", error);

       // If initial connection fails and we're in development, try an in-memory fallback
       if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
           try {
               console.log('Initial Mongo connection failed — starting in-memory MongoDB fallback...');
               const { MongoMemoryServer } = await import('mongodb-memory-server');
               const mongod = await MongoMemoryServer.create();
               mongoServerInstance = mongod;
               const memUri = mongod.getUri(projectName);
               await mongoose.connect(memUri, {
                   serverSelectionTimeoutMS: 5000,
                   connectTimeoutMS: 10000,
               });
               console.log('Connected to in-memory MongoDB for development');
           } catch (memErr) {
               console.error('Error starting in-memory MongoDB fallback:', memErr);
           }
       }
    }
}

export const stopInMemoryMongo = async () => {
    if (mongoServerInstance) {
        await mongoServerInstance.stop();
    }
}

export default connectDB;