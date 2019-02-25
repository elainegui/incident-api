package ie.incidentapp.controllers;

import ie.incidentapp.entities.Incident;
import ie.incidentapp.entities.Trend;
import ie.incidentapp.services.TrendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@RestController
public class TrendController {

    @Autowired
    private TrendService trendService;

    @Bean
    public WebMvcConfigurer corsConfigurer4() {
        return new WebMvcConfigurerAdapter() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("*");
            }
        };
    }

//    @RequestMapping(value = "trend", method = RequestMethod.GET)
//    public Iterable<Trend> listAllIncidentsFromLast12Months() {
//        return trendService.findAllFromLast12Months();
//    }

    @RequestMapping(value = "trend", method = RequestMethod.GET)
    public Iterable<Trend> listAllIncidentsFromLast12MonthsInGeographicalArea(
            @RequestParam("country") String country,
            @RequestParam("state") String state,
            @RequestParam("city") String city) {
        return trendService.findAllFromLast12Months(country, state, city);
    }


}
