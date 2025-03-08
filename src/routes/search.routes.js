import express from "express";
import { searchAndSaveResults } from "../controllers/search.controller.js";

const router = express.Router();

router.post("/", searchAndSaveResults);

export default router;
