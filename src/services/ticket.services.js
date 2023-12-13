import CustomError from "../errors/CustomError.js";
import EErrors from "../errors/enums.js";
import { generateTicketErrorInfo } from "../errors/info.js";
export default class TicketService {
  constructor(ticketDao) {
    this.ticketDao = ticketDao;
  }

  async createTicket(data) {
    try {
      const ticket = await this.ticketDao.createTicket(data);
      return ticket;
    } catch (error) {
      CustomError.createError({
        name: "Error al generar el ticket",
        message: "Error al generar el ticket",
        code: EErrors.TICKET_NOT_CREATE,
        info: generateTicketErrorInfo(error),
      });
    }
  }
}
