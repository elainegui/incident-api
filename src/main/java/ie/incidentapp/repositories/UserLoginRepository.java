package ie.incidentapp.repositories;

import org.springframework.data.repository.CrudRepository;

import ie.incidentapp.entities.UserLogin;

public interface UserLoginRepository extends CrudRepository<UserLogin, String> {

}
