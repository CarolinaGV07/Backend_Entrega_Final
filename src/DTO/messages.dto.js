export default class messageDTO {
  constructor(message) {
    this.user = message.user;
    this.message = message.message;
    this.hour = message.hour;
  }
}
