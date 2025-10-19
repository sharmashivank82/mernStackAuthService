class TenantService {
  tenantRepository;

  constructor(tenantRepo) {
    this.tenantRepository = tenantRepo;
  }

  async create(data) {
    return await this.tenantRepository.save(data);
  }

  async findAllTenants() {
    const user = await this.tenantRepository.find();
    return user;
  }
}

module.exports = { TenantService };
