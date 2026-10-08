package com.example.restaurantmanagement.repository;

import com.example.restaurantmanagement.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RestaurantRepository
        extends JpaRepository<Restaurant, String> {

    @Query(value = """
        SELECT r.restaurant_name, m.item_name, m.price
        FROM restaurant r
        JOIN menu_item m
        ON r.restaurant_id = m.restaurant_id
        """, nativeQuery = true)
    List<Object[]> getRestaurantMenu();

    @Query(value = """
    SELECT restaurant_name
    FROM restaurant
    WHERE restaurant_id IN (
        SELECT restaurant_id
        FROM menu_item
    )
    """, nativeQuery = true)
    List<Object[]> getRestaurantsWithMenu();

    List<Restaurant> findByCity(String city);
    @Query(value = """
    	    SELECT
    	        r.restaurant_id,
    	        r.restaurant_name,
    	        SUM(oi.quantity * m.price) AS total_sales
    	    FROM restaurant r
    	    JOIN orders o
    	        ON r.restaurant_id = o.restaurant_id
    	    JOIN order_item oi
    	        ON o.order_id = oi.order_id
    	    JOIN menu_item m
    	        ON oi.item_id = m.item_id
    	    GROUP BY
    	        r.restaurant_id,
    	        r.restaurant_name
    	    """, nativeQuery = true)
    	List<Object[]> getRestaurantSales();
    	
    	
    	@Query(value = """
    		    SELECT
    		        r.restaurant_name,
    		        COUNT(m.item_id) AS total_items,
    		        AVG(m.price) AS average_price,
    		        MAX(m.price) AS highest_price,
    		        MIN(m.price) AS lowest_price
    		    FROM restaurant r
    		    JOIN menu_item m
    		        ON r.restaurant_id = m.restaurant_id
    		    GROUP BY
    		        r.restaurant_id,
    		        r.restaurant_name
    		    """, nativeQuery = true)
    		List<Object[]> getRestaurantStatistics();
    		
    		
    		@Query(value = """
    			    SELECT
    			        r.restaurant_name,
    			        SUM(oi.quantity * m.price) AS total_sales
    			    FROM restaurant r
    			    JOIN orders o
    			        ON r.restaurant_id = o.restaurant_id
    			    JOIN order_item oi
    			        ON o.order_id = oi.order_id
    			    JOIN menu_item m
    			        ON oi.item_id = m.item_id
    			    GROUP BY
    			        r.restaurant_id,
    			        r.restaurant_name
    			    ORDER BY total_sales DESC
    			    LIMIT 1
    			    """, nativeQuery = true)
    			List<Object[]> getHighestSalesRestaurant();
}
