import ticketModel from "./models/ticket.mongo.models.js";

export default class TicketsMongo {
  async addTicket(ticket) {
    try {
      if (ticket) return await ticketModel.create(ticket);
    } catch (error) {
      throw error;
    }
  }
  async getTickets() {
    try {
      return await ticketModel.find().lean().exec();
    } catch (error) {
      throw error;
    }
  }
  async getTicketById(id) {
    try {
      if (id) {
        return await ticketModel
          .findById(id)
          .populate("products.pid")
          .lean()
          .exec();
      }
    } catch (error) {
      throw error;
    }
  }
  async updateTicket(id, data) {
    try {
      if ((id, data)) {
        const ticketExist = await ticketModel.findByIdAndUpdate(id, data);
        return "ticket updated";
      }
    } catch (error) {
      throw error;
    }
  }
  async deleteTicket(id) {
    try {
      if (id) {
        const ticketExist = await ticketModel.findByIdAndDelete(id);
        return "ticket deleted";
      }
    } catch (error) {
      throw error;
    }
  }
}
