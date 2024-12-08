import mongoose from "mongoose";
import "dotenv/config";
export const connectToDb = async () => {
    try {
        const response = await mongoose.connect(`${process.env.MONGODB_URL}`, {
            dbName: "imaginify-ai",
        });
        if (response)
            console.log(`DB Connected to ${response.connection.host}`);
    }
    catch (error) {
        console.log(error);
    }
};
