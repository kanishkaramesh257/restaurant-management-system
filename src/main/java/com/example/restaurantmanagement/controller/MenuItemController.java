package com.example.restaurantmanagement.controller;

import com.example.restaurantmanagement.entity.MenuItem;
import com.example.restaurantmanagement.service.MenuItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
@CrossOrigin(origins = "*")
public class MenuItemController {

    private final MenuItemService service;

    public MenuItemController(MenuItemService service) {
        this.service = service;
    }

    // GET all
    @GetMapping
    public List<MenuItem> getAllMenuItems() {
        return service.getAllMenuItems();
    }

    // GET by ID
    @GetMapping("/{id}")
    public MenuItem getMenuItemById(@PathVariable String id) {
        return service.getMenuItemById(id);
    }

    // POST
    @PostMapping
    public MenuItem addMenuItem(
            @RequestBody MenuItem menuItem) {

        return service.addMenuItem(menuItem);
    }

    // PUT
    @PutMapping("/{id}")
    public MenuItem updateMenuItem(
            @PathVariable String id,
            @RequestBody MenuItem menuItem) {

        return service.updateMenuItem(id, menuItem);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteMenuItem(@PathVariable String id) {

        service.deleteMenuItem(id);

        return "Menu item deleted successfully";
    }

    // SUBQUERY
    @GetMapping("/above-average")
    public List<Object[]> getItemsAboveAveragePrice() {

        return service.getItemsAboveAveragePrice();
    }

    // SUBQUERY
    @GetMapping("/most-expensive")
    public List<Object[]> getMostExpensiveItem() {

        return service.getMostExpensiveItem();
    }

    // CUSTOM QUERY
    @GetMapping("/below-price/{price}")
    public List<MenuItem> getItemsBelowPrice(
            @PathVariable int price) {

        return service.getItemsBelowPrice(price);
    }
    
    
    @GetMapping("/popular")
    public List<Object[]> getPopularItems() {
        return service.getPopularItems();
    }
}