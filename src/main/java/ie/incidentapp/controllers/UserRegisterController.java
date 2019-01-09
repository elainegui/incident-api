package ie.incidentapp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import ie.incidentapp.entities.UserRegister;
import ie.incidentapp.repositories.UserRegisterRepository;

@RestController
public class UserRegisterController {

	@Autowired
	private UserRegisterRepository userRegisterRepository;

	@Bean
	public WebMvcConfigurer corsConfigurer2() {
		return new WebMvcConfigurerAdapter() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedOrigins("*");
			}
		};
	}

	// @PostMapping( path = "/register", consumes = "application/json", produces =
	// "application/json")
	// public ResponseEntity<Object> createUserRegister(@RequestBody UserRegister
	// userRegister) {
	@RequestMapping(value = "/register", method = RequestMethod.POST)
	public void createUserRegister(@RequestBody UserRegister userRegister) {
		System.out.println("1");
		userRegisterRepository.save(userRegister);
	}

	/*
	 * URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
	 * .buildAndExpand(userRegister.getId()).toUri(); ResponseEntity<Object> build =
	 * ResponseEntity.created(location).build(); System.out.println("3"); return
	 * build;
	 */

}
