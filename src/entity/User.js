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

    createdAt: {
      type: "timestamp",
      createDate: true, // auto set on insert
    },
  },
  relations: {
    tenant: {
      target: "TenantDetails",
      type: "many-to-one", // multiple user belongs to a one tenant
      joinTable: true, // add userId column
      cascade: true, // if user deleted then it's records in this table were also deleted
    },
  },
});
