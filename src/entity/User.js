const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User2",
  tableName: "users2",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    firstName: {
      type: "varchar",
    },

    lastName: {
      type: "varchar",
    },

    email: {
      type: "varchar",
      unique: true,
    },

    password: {
      type: "varchar",
    },

    role: {
      type: "varchar",
    },
  },
});
