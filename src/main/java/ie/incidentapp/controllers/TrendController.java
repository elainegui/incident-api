package ie.incidentapp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import ie.incidentapp.entities.Trend;
import ie.incidentapp.repositories.TrendRepository;

@RestController
public class TrendController {

	@Autowired
	private TrendRepository trendRepository;

	@Bean
	public WebMvcConfigurer corsConfigurer4() {
		return new WebMvcConfigurerAdapter() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedOrigins("*");
			}
		};
	}

	@RequestMapping(value = "trend", method = RequestMethod.GET)
	public Iterable<Trend> listAllIncidents() {
		return trendRepository.findAll();
	}
}
