const mongodb = require("mongodb");
const bcrypt = require("bcryptjs");

const ObjectId = mongodb.ObjectId;

const db = require("../data/database");

class Auth {
  constructor(email, password, id) {
    this.email = email;
    this.password = password;
    if (id) {
      this.id = new ObjectId(id);
    }
  }

  async fetchUserByEmail() {
    if (!this.email) {
      return;
    }

    const user = await db
      .getDb()
      .collection("users")
      .findOne({ email: this.email });
    // console.log(user);
    return user;
  }

  async save() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    const user = {
      email: this.email,
      password: hashedPassword,
    };

    await db.getDb().collection("users").insertOne(user);
  }
}

module.exports = Auth;
