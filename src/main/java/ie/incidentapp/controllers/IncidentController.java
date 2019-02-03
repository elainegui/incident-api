package ie.incidentapp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import ie.incidentapp.entities.Incident;
import ie.incidentapp.repositories.IncidentRepository;
import ie.incidentapp.repositories.TrendRepository;

@RestController
public class IncidentController {

	@Autowired
	private IncidentRepository incidentRepository;

	@Autowired
	private TrendRepository trendRepository;

	@Bean
	public WebMvcConfigurer corsConfigurer3() {
		return new WebMvcConfigurerAdapter() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedOrigins("*");
			}
		};
	}

	@RequestMapping(value = "incident", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void createIncident(@RequestBody Incident incident) {
		incidentRepository.save(incident);
	}

	@RequestMapping(value = "incident", method = RequestMethod.GET)
	public Iterable<Incident> listAllIncidents() {
		return incidentRepository.findAll();
	}

	@RequestMapping(value = "incident-local", method = RequestMethod.GET)
	public Iterable<Incident> listIncidentsByRadiusInMeters(@RequestParam("latitude") double latitude,
			@RequestParam("longitude") double longitude, @RequestParam("radius") long radius) {
		return incidentRepository.findByRadiusInMeters(latitude, longitude, radius);
	}

}
