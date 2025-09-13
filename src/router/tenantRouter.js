const express = require("express");
const router = express.Router();

const AppDataSource = require("../data-source");
const TenantEntity = require("../entity/Tenant");

const TenantRepository = AppDataSource.getRepository(TenantEntity);

const { TenantController } = require("../controller/TenantController");

const { TenantService } = require("../services/TenantService");

const tenantService = new TenantService(TenantRepository);
const tenantController = new TenantController(tenantService);

router.post("/create", (req, res, next) =>
  tenantController.createTenant(req, res, next)
);

module.exports = router;
