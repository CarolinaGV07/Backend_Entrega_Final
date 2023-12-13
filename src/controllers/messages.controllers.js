import { messageService } from "../services/index.js";

export const getMessages = async (req, res) => {
  try {
    const messages = await messageService.getMessages();
    res.status(200).render("chat", { messages, css: "chat" });
  } catch (error) {
    req.logger.info("No autorizado");
    res.status(500).json({ error: error.message });
  }
};
export const saveMessage = async (req, res) => {
  try {
    const message = await messageService.saveMessage(req.body);
    res.status(201).json(message);
  } catch (error) {
    req.logger.fatal("Error al guardar el mensaje");
    res.status(500).json({ error: error.message });
  }
};
