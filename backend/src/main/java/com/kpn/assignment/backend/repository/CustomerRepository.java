package com.kpn.assignment.backend.repository;

import com.kpn.assignment.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByPhoneNumber(String phoneNumber);

    Optional<Customer> findByEmail(String email);

    List<Customer> findByLastNameContainingIgnoreCase(String nameFragment);

    List<Customer> findByFirstNameContainingIgnoreCase(String nameFragment);

    List<Customer> findByAddress(String address);

    List<Customer> findByFirstNameContainingIgnoreCaseAndLastNameContainingIgnoreCase(
            String firstNameFragment, String lastNameFragment
    );
}