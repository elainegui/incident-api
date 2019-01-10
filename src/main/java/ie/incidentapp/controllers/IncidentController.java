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

import ie.incidentapp.entities.Incident;
import ie.incidentapp.repositories.IncidentRepository;

@RestController
public class IncidentController {

	@Autowired
	private IncidentRepository incidentRepository;

	@Bean
	public WebMvcConfigurer corsConfigurer3() {
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
	@RequestMapping(value = "/incident", method = RequestMethod.POST)
	public void createIncident(@RequestBody Incident incident) {
		incidentRepository.save(incident);
	}

}
