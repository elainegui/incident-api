package ie.incidentapp.controllers;

import ie.incidentapp.services.TrendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
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

    @RequestMapping(value = "incident/country", method = RequestMethod.GET)
    public Iterable<String> listAllCountries() {
        return incidentRepository.findAllCountries();
    }

    @RequestMapping(value = "incident/country/{country}/state", method = RequestMethod.GET)
    public Iterable<String> listAllStatesByCountry(@PathVariable String country) {
        return incidentRepository.findAllStatesByCountry(country);
    }

    @RequestMapping(value = "incident/country/{country}/state/{state}/city", method = RequestMethod.GET)
    public Iterable<String> listAllCitiesByState(@PathVariable String country, @PathVariable String state) {
        return incidentRepository.findAllCitiesByState(country, state);
    }
}
