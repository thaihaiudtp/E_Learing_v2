import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL as string);
        console.log("Connect successfully")
    } catch (error) {
        console.log("Connect fail" + error)
    }
}

export default connectDB;