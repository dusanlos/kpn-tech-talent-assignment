package com.kpn.assignment.backend.service;

import com.kpn.assignment.backend.model.Customer;
import com.kpn.assignment.backend.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerService customerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void saveCustomer_ShouldReturnSavedCustomer() {
        Customer customer = new Customer();
        customer.setFirstName("John");

        when(customerRepository.save(customer)).thenReturn(customer);

        Customer result = customerService.saveCustomer(customer);

        verify(customerRepository).save(customer);
        assertThat(result).isEqualTo(customer);
    }

    @Test
    void getCustomerById_ShouldReturnCustomerOptional() {
        Customer customer = new Customer();
        customer.setId(1L);

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));

        Optional<Customer> result = customerService.getCustomerById(1L);

        verify(customerRepository).findById(1L);
        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(customer);
    }

    @Test
    void getAllCustomers_ShouldReturnListOfCustomers() {
        Customer c1 = new Customer();
        Customer c2 = new Customer();

        when(customerRepository.findAll()).thenReturn(Arrays.asList(c1, c2));

        List<Customer> result = customerService.getAllCustomers();

        verify(customerRepository).findAll();
        assertThat(result).hasSize(2).contains(c1, c2);
    }

    @Test
    void deleteCustomer_ShouldCallRepositoryDeleteById() {
        Long id = 1L;
        customerService.deleteCustomer(id);

        verify(customerRepository).deleteById(id);
    }

    @Test
    void getCustomerByPhoneNumber_ShouldReturnOptionalCustomer() {
        Customer customer = new Customer();
        customer.setPhoneNumber("1234567890");

        when(customerRepository.findByPhoneNumber("1234567890")).thenReturn(Optional.of(customer));

        Optional<Customer> result = customerService.getCustomerByPhoneNumber("1234567890");

        verify(customerRepository).findByPhoneNumber("1234567890");
        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(customer);
    }

    @Test
    void getCustomerByEmail_ShouldReturnOptionalCustomer() {
        Customer customer = new Customer();
        customer.setEmail("test@example.com");

        when(customerRepository.findByEmail("test@example.com")).thenReturn(Optional.of(customer));

        Optional<Customer> result = customerService.getCustomerByEmail("test@example.com");

        verify(customerRepository).findByEmail("test@example.com");
        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(customer);
    }

    @Test
    void searchByFirstName_ShouldReturnMatchingCustomers() {
        Customer c1 = new Customer();
        c1.setFirstName("John");

        when(customerRepository.findByFirstNameContainingIgnoreCase("John")).thenReturn(List.of(c1));

        List<Customer> result = customerService.searchByFirstName("John");

        verify(customerRepository).findByFirstNameContainingIgnoreCase("John");
        assertThat(result).containsExactly(c1);
    }

    @Test
    void searchByLastName_ShouldReturnMatchingCustomers() {
        Customer c1 = new Customer();
        c1.setLastName("Doe");

        when(customerRepository.findByLastNameContainingIgnoreCase("Doe")).thenReturn(List.of(c1));

        List<Customer> result = customerService.searchByLastName("Doe");

        verify(customerRepository).findByLastNameContainingIgnoreCase("Doe");
        assertThat(result).containsExactly(c1);
    }

    @Test
    void searchByFullName_ShouldReturnMatchingCustomers() {
        Customer c1 = new Customer();
        c1.setFirstName("John");
        c1.setLastName("Doe");

        when(customerRepository.findByFirstNameContainingIgnoreCaseAndLastNameContainingIgnoreCase("John", "Doe"))
                .thenReturn(List.of(c1));

        List<Customer> result = customerService.searchByFullName("John", "Doe");

        verify(customerRepository).findByFirstNameContainingIgnoreCaseAndLastNameContainingIgnoreCase("John", "Doe");
        assertThat(result).containsExactly(c1);
    }

    @Test
    void searchByAddress_ShouldReturnMatchingCustomers() {
        Customer c1 = new Customer();
        c1.setAddress("123 Street");

        when(customerRepository.findByAddress("123 Street")).thenReturn(List.of(c1));

        List<Customer> result = customerService.searchByAddress("123 Street");

        verify(customerRepository).findByAddress("123 Street");
        assertThat(result).containsExactly(c1);
    }
}