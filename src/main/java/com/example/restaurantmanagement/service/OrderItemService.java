package com.example.restaurantmanagement.service;

import com.example.restaurantmanagement.entity.OrderItem;
import com.example.restaurantmanagement.entity.OrderItemId;
import com.example.restaurantmanagement.repository.OrderItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemService {

    private final OrderItemRepository repository;

    public OrderItemService(OrderItemRepository repository) {
        this.repository = repository;
    }

    // CRUD

    public List<OrderItem> getAllOrderItems() {
        return repository.findAll();
    }

    public OrderItem getOrderItem(String orderId, String itemId) {

        OrderItemId id = new OrderItemId(orderId, itemId);

        return repository.findById(id).orElse(null);
    }

    public OrderItem addOrderItem(OrderItem orderItem) {
        return repository.save(orderItem);
    }

    public OrderItem updateOrderItem(
            String orderId,
            String itemId,
            OrderItem orderItem) {

        OrderItemId id = new OrderItemId(orderId, itemId);

        orderItem.setId(id);

        return repository.save(orderItem);
    }

    public void deleteOrderItem(String orderId, String itemId) {

        OrderItemId id = new OrderItemId(orderId, itemId);

        repository.deleteById(id);
    }

    // Custom query

    public List<OrderItem> getItemsByQuantity(int quantity) {
        return repository.findByQuantityGreaterThan(quantity);
    }

    // JOIN

    public List<Object[]> getOrderItemDetails() {
        return repository.getOrderItemDetails();
    }

    // Subquery

    public List<Object[]> getItemsAboveAverageQuantity() {
        return repository.getItemsAboveAverageQuantity();
    }
    
    public List<Object[]> getItemSalesSummary() {
        return repository.getItemSalesSummary();
    }
}