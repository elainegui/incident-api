package ie.incidentapp.repositories;

import org.springframework.data.repository.CrudRepository;

import ie.incidentapp.entities.UserRegister;

public interface UserRegisterRepository extends CrudRepository<UserRegister, String> {
	// public void addUserRegister(UserRegister userRegister);

	// public void addUserRegister(int id, String firstName, String lastName, String
	// country") String country, @RequestParam("city") String city),
	// @RequestParam("email") String email,);
	public UserRegister findOneByEmailAndPassword(String email, String password);

}
