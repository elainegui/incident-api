package ie.incidentapp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import ie.incidentapp.entities.UserRegister;
import ie.incidentapp.repositories.UserRegisterRepository;

@RestController
public class UserLoginController {

	@Autowired
	private UserRegisterRepository userRegisterRepository;

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurerAdapter() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedOrigins("*");
			}
		};
	}

	@RequestMapping(method = RequestMethod.GET, value = "user")
	public UserRegister getUserRegister(@RequestParam("email") String email,
			@RequestParam("password") String password) {

		return userRegisterRepository.findOneByEmailAndPassword(email, password);
	}

	// @RequestMapping(method = RequestMethod.POST, value = "register")
	// public void userRegister(@RequestBody UserRegister userRegister ) {
	// System.out.println(userRegister);
	// }
	//
	/*
	 * @RequestMapping(method = RequestMethod.POST, value = "register") public
	 * ResponseEntity<List<UserRegister>> add(@RequestBody List<UserRegister> cars)
	 * { return null; }
	 */

	// @RequestMapping(method = RequestMethod.POST, value = "register")
	// public void update(@RequestBody UserRegister userRegister ) {
	// System.out.println(userRegister);
	// }

	// @RequestMapping(method = RequestMethod.POST, value = "register")
	// public void userRegister(@RequestBody UserRegister userRegister ) {
	// System.out.println(userRegister);
	// }

	// public @ResponseBody ResponseEntity<String> postUserRegister() {
	// userRepository.save(arg0)
	// return new ResponseEntity<String>("POST Response", HttpStatus.OK);
	// }

	// @RequestMapping(method = RequestMethod.GET, value = "register")
	// public User getUserRegister(@RequestParam("id") String id,
	// @RequestParam("firstName") String firstName, @RequestParam("lastName") String
	// lastName,
	// @RequestParam("country") String country, @RequestParam("city") String city),
	// @RequestParam("email") String email, @RequestParam("firstName") String
	// firstName {

	// public UserRegister getUserRegister(@RequestParam("email") String email) {
	// return userRepository.findByEmail(email);
}
