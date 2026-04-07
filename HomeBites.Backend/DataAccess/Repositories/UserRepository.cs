using DataAccess.Entities;

namespace DataAccess.Repositories;

public interface IUserRepository : IGenericRepository<User>
{
}

public class UserRepository : GenericRepository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context)
    {
    }
}
