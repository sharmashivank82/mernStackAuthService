const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "TenantDetails",
  tableName: "tenants",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    name: {
      type: "varchar",
      require: true,
      length: 100,
    },

    address: {
      type: "varchar",
      require: true,
      length: 255,
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
});
