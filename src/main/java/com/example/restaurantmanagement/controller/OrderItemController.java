package com.example.restaurantmanagement.controller;

import com.example.restaurantmanagement.entity.OrderItem;
import com.example.restaurantmanagement.service.OrderItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
@CrossOrigin(origins = "*")
public class OrderItemController {

    private final OrderItemService service;

    public OrderItemController(OrderItemService service) {
        this.service = service;
    }

    // GET all
    @GetMapping
    public List<OrderItem> getAllOrderItems() {
        return service.getAllOrderItems();
    }

    // GET by order ID and item ID
    @GetMapping("/{orderId}/{itemId}")
    public OrderItem getOrderItem(
            @PathVariable String orderId,
            @PathVariable String itemId) {

        return service.getOrderItem(orderId, itemId);
    }

    // POST
    @PostMapping
    public OrderItem addOrderItem(
            @RequestBody OrderItem orderItem) {

        return service.addOrderItem(orderItem);
    }

    // PUT
    @PutMapping("/{orderId}/{itemId}")
    public OrderItem updateOrderItem(
            @PathVariable String orderId,
            @PathVariable String itemId,
            @RequestBody OrderItem orderItem) {

        return service.updateOrderItem(
                orderId,
                itemId,
                orderItem
        );
    }

    // DELETE
    @DeleteMapping("/{orderId}/{itemId}")
    public String deleteOrderItem(
            @PathVariable String orderId,
            @PathVariable String itemId) {

        service.deleteOrderItem(orderId, itemId);

        return "Order item deleted successfully";
    }

    // JOIN
    @GetMapping("/details")
    public List<Object[]> getOrderItemDetails() {

        return service.getOrderItemDetails();
    }

    // SUBQUERY
    @GetMapping("/above-average")
    public List<Object[]> getItemsAboveAverageQuantity() {

        return service.getItemsAboveAverageQuantity();
    }

    // CUSTOM QUERY
    @GetMapping("/quantity/{quantity}")
    public List<OrderItem> getItemsByQuantity(
            @PathVariable int quantity) {

        return service.getItemsByQuantity(quantity);
    }
    
    
    @GetMapping("/sales-summary")
    public List<Object[]> getItemSalesSummary() {
        return service.getItemSalesSummary();
    }
}