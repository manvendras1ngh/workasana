import express from "express";
import {
  userSignup,
  userLogin,
  getUser,
  userLogout,
} from "../controllers/auth.controllers.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const router = express.Router();

router.get("/me", verifyJWT, getUser);
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/logout", userLogout);

export default router;
