import express from "express";
import { getSearchResults, getVerifiedResults } from "../controllers/get.controller.js";

const router = express.Router();

router.get("/search/:id", getSearchResults);
router.get("/verified", getVerifiedResults);

export default router;
