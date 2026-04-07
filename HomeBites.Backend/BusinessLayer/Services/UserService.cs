using DataAccess.Entities;
using DataAccess.Repositories;

namespace BusinessLayer.Services;

public interface IUserService
{

}

public class UserService : IUserService
{
    private readonly IUserRepository _repository;

    public UserService(IUserRepository repository)
    {
        _repository = repository;
    }


}
