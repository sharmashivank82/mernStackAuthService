const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "RefreshToken",
  tableName: "refreshToken",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    expireAt: {
      type: "timestamp",
    },

    createdAt: {
      type: "timestamp",
      createDate: true, // auto set on insert
    },

    updatedAt: {
      type: "timestamp",
      updateDate: true, // auto set on update
    },
  },
  // generate userId in database
  relations: {
    userId: {
      target: "User2",
      type: "many-to-one",
      joinTable: true, // add userId column
      cascade: true, // if user deleted then it's records in this table were also deleted
    },
  },
});
