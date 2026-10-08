package com.example.restaurantmanagement.service;

import com.example.restaurantmanagement.entity.Restaurant;
import com.example.restaurantmanagement.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantService {

    private final RestaurantRepository repository;

    public RestaurantService(RestaurantRepository repository) {
        this.repository = repository;
    }

    // CRUD

    public List<Restaurant> getAllRestaurants() {
        return repository.findAll();
    }

    public Restaurant getRestaurantById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Restaurant addRestaurant(Restaurant restaurant) {
        return repository.save(restaurant);
    }

    public Restaurant updateRestaurant(
            String id,
            Restaurant restaurant) {

        restaurant.setRestaurantId(id);

        return repository.save(restaurant);
    }

    public void deleteRestaurant(String id) {
        repository.deleteById(id);
    }

    // Custom query

    public List<Restaurant> getRestaurantsByCity(String city) {
        return repository.findByCity(city);
    }

    // JOIN

    public List<Object[]> getRestaurantMenu() {
        return repository.getRestaurantMenu();
    }

    // Subquery

    public List<Object[]> getRestaurantsWithMenu() {
        return repository.getRestaurantsWithMenu();
    }
    
    
    public List<Object[]> getRestaurantSales() {
        return repository.getRestaurantSales();
    }
    
    public List<Object[]> getRestaurantStatistics() {
        return repository.getRestaurantStatistics();
    }
    public List<Object[]> getHighestSalesRestaurant() {
        return repository.getHighestSalesRestaurant();
    }
}