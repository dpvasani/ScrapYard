import express from "express";
import { approveLinks } from "../controllers/approval.controller.js";

const router = express.Router();

router.post("/", approveLinks);

export default router;
