package com.example.restaurantmanagement.repository;

import com.example.restaurantmanagement.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface StaffRepository extends JpaRepository<Staff, String> {
    @Query(value = """
    SELECT s.staff_name, s.role, r.restaurant_name
    FROM staff s
    JOIN restaurant r
    ON s.restaurant_id = r.restaurant_id
    """, nativeQuery = true)
    List<Object[]> getStaffWithRestaurant();

    @Query(value = """
    SELECT staff_name, role
    FROM staff
    WHERE restaurant_id IN (
        SELECT restaurant_id
        FROM restaurant
        WHERE city = 'Chennai'
    )
    """, nativeQuery = true)
    List<Object[]> getStaffInChennai();

    List<Staff> findByRole(String role);
}