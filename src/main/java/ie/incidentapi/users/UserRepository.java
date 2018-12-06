package ie.incidentapi.users;

import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, String> {
	
	public User findOneByEmailAndPassword(String email, String password);
	

}
