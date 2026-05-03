import express, { Router } from "express";
import { ChatController } from "./chat.controller";

const router = express.Router();

// POST /api/v1/chat - AI chat endpoint
router.post("/", ChatController.chat);

export const ChatRoutes: Router = router;