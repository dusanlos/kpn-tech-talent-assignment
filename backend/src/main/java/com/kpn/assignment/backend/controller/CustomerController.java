package com.kpn.assignment.backend.controller;

import com.kpn.assignment.backend.model.Customer;
import com.kpn.assignment.backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

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
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerService.saveCustomer(customer);
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/search")
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
    public Optional<Customer> getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id);
    }

    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Long id, @RequestBody Customer updatedCustomer) {
        Optional<Customer> existing = customerService.getCustomerById(id);
        if (existing.isPresent()) {
            Customer customer = existing.get();
            customer.setFirstName(updatedCustomer.getFirstName());
            customer.setLastName(updatedCustomer.getLastName());
            customer.setAddress(updatedCustomer.getAddress());
            customer.setPhoneNumber(updatedCustomer.getPhoneNumber());
            customer.setEmail(updatedCustomer.getEmail());
            return customerService.saveCustomer(customer);
        } else {
            throw new RuntimeException("Customer not found");
        }
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
    }
}