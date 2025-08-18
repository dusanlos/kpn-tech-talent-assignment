package com.kpn.assignment.backend.controller;

import com.kpn.assignment.backend.exception.CustomerNotFoundException;
import com.kpn.assignment.backend.model.Customer;
import com.kpn.assignment.backend.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CustomerControllerTest {

    @Mock
    private CustomerService customerService;

    @InjectMocks
    private CustomerController customerController;

    private Customer customer;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        customer = new Customer();
        customer.setId(1L);
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setEmail("john.doe@example.com");
        customer.setPhoneNumber("1234567890");
        customer.setAddress("123 Main St");
    }

    @Test
    void testGetCustomerById_Found() {
        when(customerService.getCustomerById(1L)).thenReturn(Optional.of(customer));

        ResponseEntity<Customer> response = customerController.getCustomerById(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(customer, response.getBody());
        verify(customerService, times(1)).getCustomerById(1L);
    }

    @Test
    void testGetCustomerById_NotFound() {
        when(customerService.getCustomerById(1L)).thenReturn(Optional.empty());

        assertThrows(CustomerNotFoundException.class, () -> customerController.getCustomerById(1L));
        verify(customerService, times(1)).getCustomerById(1L);
    }

    @Test
    void testCreateCustomer() {
        when(customerService.saveCustomer(customer)).thenReturn(customer);

        ResponseEntity<Customer> response = customerController.createCustomer(customer);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(customer, response.getBody());
        verify(customerService, times(1)).saveCustomer(customer);
    }

    @Test
    void testGetAllCustomers() {
        when(customerService.getAllCustomers()).thenReturn(List.of(customer));

        List<Customer> response = customerController.getAllCustomers();

        assertEquals(1, response.size());
        assertEquals(customer, response.get(0));
        verify(customerService, times(1)).getAllCustomers();
    }

    @Test
    void testDeleteCustomer_Found() {
        when(customerService.getCustomerById(1L)).thenReturn(Optional.of(customer));
        doNothing().when(customerService).deleteCustomer(1L);

        ResponseEntity<Void> response = customerController.deleteCustomer(1L);

        assertEquals(204, response.getStatusCodeValue());
        verify(customerService, times(1)).deleteCustomer(1L);
    }

    @Test
    void testDeleteCustomer_NotFound() {
        when(customerService.getCustomerById(1L)).thenReturn(Optional.empty());

        assertThrows(CustomerNotFoundException.class, () -> customerController.deleteCustomer(1L));
        verify(customerService, never()).deleteCustomer(anyLong());
    }
}