import { v2 as cloudinary } from "cloudinary";
import { cloud_name, api_key, api_secret } from "./index.js";

cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret
});

export default cloudinary