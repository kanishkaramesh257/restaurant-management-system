package com.example.restaurantmanagement.service;

import com.example.restaurantmanagement.entity.MenuItem;
import com.example.restaurantmanagement.repository.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuItemService {

    private final MenuItemRepository repository;

    public MenuItemService(MenuItemRepository repository) {
        this.repository = repository;
    }

    // CRUD

    public List<MenuItem> getAllMenuItems() {
        return repository.findAll();
    }

    public MenuItem getMenuItemById(String id) {
        return repository.findById(id).orElse(null);
    }

    public MenuItem addMenuItem(MenuItem item) {
        return repository.save(item);
    }

    public MenuItem updateMenuItem(String id, MenuItem item) {
        item.setItemId(id);
        return repository.save(item);
    }

    public void deleteMenuItem(String id) {
        repository.deleteById(id);
    }

    // Custom query

    public List<MenuItem> getItemsBelowPrice(int price) {
        return repository.findByPriceLessThan(price);
    }

    // Subquery

    public List<Object[]> getItemsAboveAveragePrice() {
        return repository.getItemsAboveAveragePrice();
    }

    // Subquery

    public List<Object[]> getMostExpensiveItem() {
        return repository.getMostExpensiveItem();
    }
    
    
    public List<Object[]> getPopularItems() {
        return repository.getPopularItems();
    }
}