import express from "express";
import {
  getAllSessions,
  createSession,
  updateSession,
  deleteSession,
} from "../controllers/sessionController.js";

const router = express.Router();

//GET
router.get("/sessions", getAllSessions);

//POST
router.post("/session/new", createSession);

//PUT
router.put("/session/:id", updateSession);

//DELETE
router.delete("/session/:id", deleteSession);

export default router;