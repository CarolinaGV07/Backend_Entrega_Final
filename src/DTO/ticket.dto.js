export default class ticketDTO {
  constructor(ticket) {
    this.code = ticket.code;
    this.purchase_datetime = ticket.purchase_datetime;
    this.amount = ticket.amount;
    this.purcharser = ticket.purcharser;
  }
}
