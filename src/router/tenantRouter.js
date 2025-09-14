const express = require("express");
const router = express.Router();

const AppDataSource = require("../data-source");
const TenantEntity = require("../entity/Tenant");

const TenantRepository = AppDataSource.getRepository(TenantEntity);

const { TenantController } = require("../controller/TenantController");

const { TenantService } = require("../services/TenantService");

const Authenticate = require("../middlewares/Authenticate");
const CanAccess = require("../middlewares/CanAccess");
const Roles = require("../constants");

const tenantService = new TenantService(TenantRepository);
const tenantController = new TenantController(tenantService);

// Only Admin Can access this route you need to add Authenticate for Admin
router.post(
  "/create",
  [Authenticate, CanAccess([Roles.ADMIN])],
  (req, res, next) => tenantController.createTenant(req, res, next)
);

module.exports = router;
