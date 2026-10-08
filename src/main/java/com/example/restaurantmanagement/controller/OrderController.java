package com.example.restaurantmanagement.controller;

import com.example.restaurantmanagement.entity.Order;
import com.example.restaurantmanagement.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    // GET all
    @GetMapping
    public List<Order> getAllOrders() {
        return service.getAllOrders();
    }

    // GET by ID
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable String id) {
        return service.getOrderById(id);
    }

    // POST
    @PostMapping
    public Order addOrder(
            @RequestBody Order order) {

        return service.addOrder(order);
    }

    // PUT
    @PutMapping("/{id}")
    public Order updateOrder(
            @PathVariable String id,
            @RequestBody Order order) {

        return service.updateOrder(id, order);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteOrder(@PathVariable String id) {

        service.deleteOrder(id);

        return "Order deleted successfully";
    }

    // JOIN
    @GetMapping("/restaurants")
    public List<Object[]> getOrderRestaurants() {

        return service.getOrderRestaurants();
    }

    // JOIN
    @GetMapping("/details")
    public List<Object[]> getOrderDetails() {

        return service.getOrderDetails();
    }

    // SUBQUERY
    @GetMapping("/arun")
    public List<Object[]> getArunOrders() {

        return service.getArunOrders();
    }

    // CUSTOM QUERY
    @GetMapping("/restaurant/{restaurantId}")
    public List<Order> getOrdersByRestaurant(
            @PathVariable String restaurantId) {

        return service.getOrdersByRestaurant(restaurantId);
    }
    
    
    @GetMapping("/totals")
    public List<Object[]> getOrderTotals() {
        return service.getOrderTotals();
    }
    
    
    @GetMapping("/above-average")
    public List<Object[]> getOrdersAboveAverage() {
        return service.getOrdersAboveAverage();
    }
}