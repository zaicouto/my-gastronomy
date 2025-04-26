import People from "../models/people.js";

export default class PeopleController {
  constructor(ctx = new People()) {
    this.ctx = ctx;
  }

  async getAllPeople() {
    const people = await this.ctx.getAllPeople();
    return people;
  }

  async deleteUser(userId) {
    await this.ctx.deleteUser(userId);
    return "User deleted successfully";
  }

  async updateUser(userId, userData) {
    const result = await this.ctx.updateUser(userId, userData);
    return {
      message: "User updated successfully",
      userId: result._id,
    };
  }
}
