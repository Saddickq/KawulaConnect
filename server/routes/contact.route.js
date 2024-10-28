import { Router } from "express";
import ContactController from "../controllers/contact.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.post("/api/search_contacts", verifyToken, ContactController.searchContact);

router.get("/api/get_contacts_list", verifyToken, ContactController.getContactFromDM);

export default router;
