package com.example.restaurantmanagement.repository;

import com.example.restaurantmanagement.entity.OrderItem;
import com.example.restaurantmanagement.entity.OrderItemId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository
        extends JpaRepository<OrderItem, OrderItemId> {
    @Query(value = """
    SELECT oi.order_id,
           m.item_name,
           oi.quantity,
           m.price
    FROM order_item oi
    JOIN menu_item m
    ON oi.item_id = m.item_id
    """, nativeQuery = true)
    List<Object[]> getOrderItemDetails();

    @Query(value = """
    SELECT order_id, item_id, quantity
    FROM order_item
    WHERE quantity > (
        SELECT AVG(quantity)
        FROM order_item
    )
    """, nativeQuery = true)
    List<Object[]> getItemsAboveAverageQuantity();

    List<OrderItem> findByQuantityGreaterThan(int quantity);
    
    @Query(value = """
    	    SELECT
    	        m.item_id,
    	        m.item_name,
    	        r.restaurant_name,
    	        SUM(oi.quantity) AS total_quantity,
    	        COUNT(DISTINCT oi.order_id) AS total_orders,
    	        SUM(oi.quantity * m.price) AS total_revenue
    	    FROM order_item oi
    	    JOIN menu_item m
    	        ON oi.item_id = m.item_id
    	    JOIN restaurant r
    	        ON m.restaurant_id = r.restaurant_id
    	    GROUP BY
    	        m.item_id,
    	        m.item_name,
    	        r.restaurant_name
    	    ORDER BY total_revenue DESC
    	    """, nativeQuery = true)
    	List<Object[]> getItemSalesSummary();
}