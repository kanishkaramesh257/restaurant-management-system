package com.example.restaurantmanagement.repository;

import com.example.restaurantmanagement.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MenuItemRepository
        extends JpaRepository<MenuItem, String> {

    @Query(value = """
        SELECT item_name, price
        FROM menu_item
        WHERE price > (
            SELECT AVG(price)
            FROM menu_item
        )
        """, nativeQuery = true)
    List<Object[]> getItemsAboveAveragePrice();


    @Query(value = """
    SELECT item_name, price
    FROM menu_item
    WHERE price = (
        SELECT MAX(price)
        FROM menu_item
    )
    """, nativeQuery = true)
    List<Object[]> getMostExpensiveItem();

    List<MenuItem> findByPriceLessThan(int price);
    
    
    @Query(value = """
    	    SELECT
    	        m.item_id,
    	        m.item_name,
    	        SUM(oi.quantity) AS total_quantity
    	    FROM menu_item m
    	    JOIN order_item oi
    	        ON m.item_id = oi.item_id
    	    GROUP BY
    	        m.item_id,
    	        m.item_name
    	    ORDER BY total_quantity DESC
    	    """, nativeQuery = true)
    	List<Object[]> getPopularItems();
}