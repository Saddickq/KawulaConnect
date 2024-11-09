import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const DB_URL = process.env.DB_URL;

const SECRET = process.env.SECRET;

const cloud_name = process.env.cloud_name;

const api_key = process.env.api_key;

const api_secret = process.env.api_secret;

export { PORT, DB_URL, SECRET, cloud_name, api_key, api_secret };
