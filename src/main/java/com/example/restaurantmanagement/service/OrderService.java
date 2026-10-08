package com.example.restaurantmanagement.service;

import com.example.restaurantmanagement.entity.Order;
import com.example.restaurantmanagement.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository repository;

    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }

    // CRUD

    public List<Order> getAllOrders() {
        return repository.findAll();
    }

    public Order getOrderById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Order addOrder(Order order) {
        return repository.save(order);
    }

    public Order updateOrder(String id, Order order) {
        order.setOrderId(id);
        return repository.save(order);
    }

    public void deleteOrder(String id) {
        repository.deleteById(id);
    }

    // Custom query

    public List<Order> getOrdersByRestaurant(String restaurantId) {
        return repository.findByRestaurantId(restaurantId);
    }

    // JOIN

    public List<Object[]> getOrderRestaurants() {
        return repository.getOrderRestaurants();
    }

    // JOIN

    public List<Object[]> getOrderDetails() {
        return repository.getOrderDetails();
    }

    // Subquery

    public List<Object[]> getArunOrders() {
        return repository.getArunOrders();
    }
    
    
    public List<Object[]> getOrderTotals() {
        return repository.getOrderTotals();
    }
    
    
    public List<Object[]> getOrdersAboveAverage() {
        return repository.getOrdersAboveAverage();
    }
}