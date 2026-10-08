package com.example.restaurantmanagement.controller;

import com.example.restaurantmanagement.entity.Restaurant;
import com.example.restaurantmanagement.service.RestaurantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {

    private final RestaurantService service;

    public RestaurantController(RestaurantService service) {
        this.service = service;
    }

    // GET all restaurants
    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return service.getAllRestaurants();
    }

    // GET restaurant by ID
    @GetMapping("/{id}")
    public Restaurant getRestaurantById(
            @PathVariable String id) {

        return service.getRestaurantById(id);
    }

    // ADD restaurant
    @PostMapping
    public Restaurant addRestaurant(
            @RequestBody Restaurant restaurant) {

        return service.addRestaurant(restaurant);
    }

    // UPDATE restaurant
    @PutMapping("/{id}")
    public Restaurant updateRestaurant(
            @PathVariable String id,
            @RequestBody Restaurant restaurant) {

        return service.updateRestaurant(id, restaurant);
    }

    // DELETE restaurant
    @DeleteMapping("/{id}")
    public String deleteRestaurant(
            @PathVariable String id) {

        service.deleteRestaurant(id);

        return "Restaurant deleted successfully";
    }

    // Find restaurants by city
    @GetMapping("/city/{city}")
    public List<Restaurant> getRestaurantsByCity(
            @PathVariable String city) {

        return service.getRestaurantsByCity(city);
    }

    // JOIN query
    @GetMapping("/menu")
    public List<Object[]> getRestaurantMenu() {

        return service.getRestaurantMenu();
    }

    // Subquery
    @GetMapping("/with-menu")
    public List<Object[]> getRestaurantsWithMenu() {

        return service.getRestaurantsWithMenu();
    }
    
    
    @GetMapping("/sales")
    public List<Object[]> getRestaurantSales() {
        return service.getRestaurantSales();
    }
    
    
    @GetMapping("/statistics")
    public List<Object[]> getRestaurantStatistics() {
        return service.getRestaurantStatistics();
    }
    
    
    @GetMapping("/highest-sales")
    public List<Object[]> getHighestSalesRestaurant() {
        return service.getHighestSalesRestaurant();
    }
}