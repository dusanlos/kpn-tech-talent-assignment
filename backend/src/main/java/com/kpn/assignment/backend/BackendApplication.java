package com.kpn.assignment.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.kpn.assignment.backend.model.User;
import com.kpn.assignment.backend.repository.UserRepository;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if(userRepository.count() == 0) {
                userRepository.save(new User("admin", passwordEncoder.encode("admin123"), "ROLE_ADMIN"));
                userRepository.save(new User("user1", passwordEncoder.encode("user123"), "ROLE_USER"));
                userRepository.save(new User("user2", passwordEncoder.encode("password"), "ROLE_USER"));
            }
        };
    }
}