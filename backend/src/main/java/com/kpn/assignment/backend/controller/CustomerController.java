package com.kpn.assignment.backend.controller;

import com.kpn.assignment.backend.exception.CustomerNotFoundException;
import com.kpn.assignment.backend.model.Customer;
import com.kpn.assignment.backend.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody Customer customer) {
        Customer savedCustomer = customerService.saveCustomer(customer);
        return ResponseEntity.ok(savedCustomer);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> searchCustomers(
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String address
    ) {
        if (!isEmpty(phoneNumber)) {
            return customerService.getCustomerByPhoneNumber(phoneNumber)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }

        if (!isEmpty(email)) {
            return customerService.getCustomerByEmail(email)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }

        List<Customer> result = List.of();

        if (!isEmpty(firstName) && !isEmpty(lastName)) {
            result = customerService.searchByFullName(firstName, lastName);
        } else if (!isEmpty(firstName)) {
            result = customerService.searchByFirstName(firstName);
        } else if (!isEmpty(lastName)) {
            result = customerService.searchByLastName(lastName);
        } else if (!isEmpty(address)) {
            result = customerService.searchByAddress(address);
        }

        if (result.isEmpty()) {
            return ResponseEntity.badRequest().body("At least one valid search parameter is required");
        }

        return ResponseEntity.ok(result);
    }

    private boolean isEmpty(String value) {
        return value == null || value.isBlank();
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        Customer customer = customerService.getCustomerById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer with id " + id + " not found"));
        return ResponseEntity.ok(customer);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Customer> updateCustomer(
            @PathVariable Long id, 
            @Valid @RequestBody Customer updatedCustomer
    ) {
        Optional<Customer> existing = customerService.getCustomerById(id);
        if (existing.isPresent()) {
            Customer customer = existing.get();
            customer.setFirstName(updatedCustomer.getFirstName());
            customer.setLastName(updatedCustomer.getLastName());
            customer.setAddress(updatedCustomer.getAddress());
            customer.setPhoneNumber(updatedCustomer.getPhoneNumber());
            customer.setEmail(updatedCustomer.getEmail());
            Customer saved = customerService.saveCustomer(customer);
            return ResponseEntity.ok(saved);
        } else {
            throw new CustomerNotFoundException("Customer with id " + id + " not found");
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        if (customerService.getCustomerById(id).isEmpty()) {
            throw new CustomerNotFoundException("Customer with id " + id + " not found");
        }
    
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}