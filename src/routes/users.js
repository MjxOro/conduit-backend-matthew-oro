import { Router } from "express";
const router = Router();
import { registerUser, getUser } from "../controllers/users";

router.post("/", registerUser);
router.get("/", getUser);

export default router;