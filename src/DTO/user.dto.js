export default class userDTO {
  constructor(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.age = user.age;
    this.rol = user.rol;
    this._id = user._id;
  }
}
