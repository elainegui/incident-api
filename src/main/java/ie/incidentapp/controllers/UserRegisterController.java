package ie.incidentapp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

//    @RequestMapping(value = "/register", method = RequestMethod.POST)
//    public ResponseEntity createUserRegister(@RequestBody UserRegister userRegister) {
//        userRegisterRepository.save(userRegister);
//        return new ResponseEntity<>("aaa", HttpStatus.OK);
//    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void createUserRegister(@RequestBody UserRegister userRegister) {
        userRegisterRepository.save(userRegister);
    }


    @RequestMapping(method = RequestMethod.GET, value = "user")
    public UserRegister getUserRegister(@RequestParam("email") String email) {

        return userRegisterRepository.findOneByEmail(email);
    }

}
