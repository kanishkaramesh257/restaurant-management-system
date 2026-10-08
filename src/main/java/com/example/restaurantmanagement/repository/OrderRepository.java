package com.example.restaurantmanagement.repository;

import com.example.restaurantmanagement.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    @Query(value = """
    SELECT o.order_id, r.restaurant_name, o.order_date
    FROM orders o
    JOIN restaurant r
    ON o.restaurant_id = r.restaurant_id
    """, nativeQuery = true)
    List<Object[]> getOrderRestaurants();

    @Query(value = """
    SELECT o.order_id,
           c.customer_name,
           r.restaurant_name,
           o.order_date
    FROM orders o
    JOIN customer c
    ON o.customer_id = c.customer_id
    JOIN restaurant r
    ON o.restaurant_id = r.restaurant_id
    """, nativeQuery = true)
    List<Object[]> getOrderDetails();

    @Query(value = """
    SELECT order_id, order_date
    FROM orders
    WHERE customer_id = (
        SELECT customer_id
        FROM customer
        WHERE customer_name = 'Arun Kumar'
    )
    """, nativeQuery = true)
    List<Object[]> getArunOrders();
    

    List<Order> findByRestaurantId(String restaurantId);
    @Query(value = """
    	    SELECT 
    	        o.order_id,
    	        c.customer_name,
    	        r.restaurant_name,
    	        o.order_date,
    	        SUM(oi.quantity * m.price) AS total_amount
    	    FROM orders o
    	    JOIN customer c
    	        ON o.customer_id = c.customer_id
    	    JOIN restaurant r
    	        ON o.restaurant_id = r.restaurant_id
    	    JOIN order_item oi
    	        ON o.order_id = oi.order_id
    	    JOIN menu_item m
    	        ON oi.item_id = m.item_id
    	    GROUP BY 
    	        o.order_id,
    	        c.customer_name,
    	        r.restaurant_name,
    	        o.order_date
    	    """, nativeQuery = true)
    	List<Object[]> getOrderTotals();
    	
    	
    	@Query(value = """
    		    SELECT
    		        o.order_id,
    		        c.customer_name,
    		        SUM(oi.quantity * m.price) AS total_amount
    		    FROM orders o
    		    JOIN customer c
    		        ON o.customer_id = c.customer_id
    		    JOIN order_item oi
    		        ON o.order_id = oi.order_id
    		    JOIN menu_item m
    		        ON oi.item_id = m.item_id
    		    GROUP BY
    		        o.order_id,
    		        c.customer_name
    		    HAVING SUM(oi.quantity * m.price) > (
    		        SELECT AVG(order_total)
    		        FROM (
    		            SELECT
    		                o2.order_id,
    		                SUM(oi2.quantity * m2.price) AS order_total
    		            FROM orders o2
    		            JOIN order_item oi2
    		                ON o2.order_id = oi2.order_id
    		            JOIN menu_item m2
    		                ON oi2.item_id = m2.item_id
    		            GROUP BY o2.order_id
    		        ) AS order_totals
    		    )
    		    """, nativeQuery = true)
    		List<Object[]> getOrdersAboveAverage();
}