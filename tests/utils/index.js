// import { DataSource } from "typeorm";

const truncateTable = async (connection) => {
  const entities = connection.entityMetadatas;
  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository?.clear();
  }
};

module.export = { truncateTable };
