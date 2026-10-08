package com.example.restaurantmanagement.controller;

import com.example.restaurantmanagement.entity.Customer;
import com.example.restaurantmanagement.service.CustomerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    // GET all
    @GetMapping
    public List<Customer> getAllCustomers() {
        return service.getAllCustomers();
    }

    // GET by ID
    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable String id) {
        return service.getCustomerById(id);
    }

    // POST
    @PostMapping
    public Customer addCustomer(
            @RequestBody Customer customer) {

        return service.addCustomer(customer);
    }

    // PUT
    @PutMapping("/{id}")
    public Customer updateCustomer(
            @PathVariable String id,
            @RequestBody Customer customer) {

        return service.updateCustomer(id, customer);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteCustomer(@PathVariable String id) {

        service.deleteCustomer(id);

        return "Customer deleted successfully";
    }

    // JOIN
    @GetMapping("/orders")
    public List<Object[]> getCustomerOrders() {

        return service.getCustomerOrders();
    }

    // SUBQUERY
    @GetMapping("/with-orders")
    public List<Object[]> getCustomersWithOrders() {

        return service.getCustomersWithOrders();
    }

    // CUSTOM QUERY
    @GetMapping("/search/{name}")
    public List<Customer> searchCustomers(
            @PathVariable String name) {

        return service.searchCustomers(name);
    }
    
    
    @GetMapping("/spending")
    public List<Object[]> getCustomerSpending() {
        return service.getCustomerSpending();
    }
}