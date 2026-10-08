package com.example.restaurantmanagement.service;

import com.example.restaurantmanagement.entity.Customer;
import com.example.restaurantmanagement.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    // CRUD

    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    public Customer getCustomerById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Customer addCustomer(Customer customer) {
        return repository.save(customer);
    }

    public Customer updateCustomer(String id, Customer customer) {
        customer.setCustomerId(id);
        return repository.save(customer);
    }

    public void deleteCustomer(String id) {
        repository.deleteById(id);
    }

    // Custom query

    public List<Customer> searchCustomers(String name) {
        return repository.findByCustomerNameContaining(name);
    }

    // JOIN

    public List<Object[]> getCustomerOrders() {
        return repository.getCustomerOrders();
    }

    // Subquery

    public List<Object[]> getCustomersWithOrders() {
        return repository.getCustomersWithOrders();
    }
    
    
    public List<Object[]> getCustomerSpending() {
        return repository.getCustomerSpending();
    }
}