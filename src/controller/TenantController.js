class TenantController {
  tenantService;

  constructor(TenantService) {
    this.tenantService = TenantService;
  }

  async createTenant(req, res, next) {
    try {
      const { name, address } = req.body;
      const tenant = await this.tenantService.create({ name, address });

      res.status(201).json({ id: tenant.id });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = { TenantController };
