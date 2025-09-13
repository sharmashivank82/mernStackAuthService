class TenantService {
  tenantRepository;

  constructor(tenantRepo) {
    this.tenantRepository = tenantRepo;
  }

  async create(data) {
    return await this.tenantRepository.save(data);
  }
}

module.exports = { TenantService };
