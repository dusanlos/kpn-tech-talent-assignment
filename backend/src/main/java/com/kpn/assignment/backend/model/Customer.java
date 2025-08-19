package com.kpn.assignment.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import com.kpn.assignment.backend.exception.ValidPhoneNumber;

@Entity
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name can't be longer than 50 characters")
    @Column(nullable = false)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name can't be longer than 50 characters")
    @Column(nullable = false)
    private String lastName;

    @Size(max = 255, message = "Address can't be longer than 255 characters")
    private String address;

    @NotBlank(message = "Phone number is required")
    @ValidPhoneNumber
    @Column(unique = true, nullable = false)
    private String phoneNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    @Column(unique = true, nullable = false)
    private String email;
}