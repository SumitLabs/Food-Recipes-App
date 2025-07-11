import "dotenv/config";

export const ENV={
    PORT:process.env.PORT||5001,
    DATABASE_URI:process.env.DATABASE_URI,
}