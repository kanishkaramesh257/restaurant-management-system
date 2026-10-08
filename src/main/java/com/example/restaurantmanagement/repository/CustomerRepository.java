package com.example.restaurantmanagement.repository;

import com.example.restaurantmanagement.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, String> {
    @Query(value = """
    SELECT c.customer_name, o.order_id, o.order_date
    FROM customer c
    JOIN orders o
    ON c.customer_id = o.customer_id
    """, nativeQuery = true)
    List<Object[]> getCustomerOrders();

    @Query(value = """
    SELECT customer_name
    FROM customer
    WHERE customer_id IN (
        SELECT customer_id
        FROM orders
    )
    """, nativeQuery = true)
    List<Object[]> getCustomersWithOrders();

    List<Customer> findByCustomerNameContaining(String name);
    
    @Query(value = """
    	    SELECT
    	        c.customer_id,
    	        c.customer_name,
    	        COUNT(DISTINCT o.order_id) AS total_orders,
    	        SUM(oi.quantity * m.price) AS total_spent
    	    FROM customer c
    	    JOIN orders o
    	        ON c.customer_id = o.customer_id
    	    JOIN order_item oi
    	        ON o.order_id = oi.order_id
    	    JOIN menu_item m
    	        ON oi.item_id = m.item_id
    	    GROUP BY
    	        c.customer_id,
    	        c.customer_name
    	    """, nativeQuery = true)
    	List<Object[]> getCustomerSpending();
    	
    	
    	@Query(value = """
    		    SELECT
    		        c.customer_name,
    		        o.order_id,
    		        o.order_date,
    		        r.restaurant_name,
    		        m.item_name,
    		        oi.quantity,
    		        m.price,
    		        oi.quantity * m.price AS item_total
    		    FROM customer c
    		    JOIN orders o
    		        ON c.customer_id = o.customer_id
    		    JOIN restaurant r
    		        ON o.restaurant_id = r.restaurant_id
    		    JOIN order_item oi
    		        ON o.order_id = oi.order_id
    		    JOIN menu_item m
    		        ON oi.item_id = m.item_id
    		    WHERE c.customer_id = :customerId
    		    ORDER BY o.order_date DESC
    		    """, nativeQuery = true)
    		List<Object[]> getCustomerOrderHistory(String customerId);
}