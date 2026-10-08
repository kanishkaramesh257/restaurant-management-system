
package com.example.restaurantmanagement.controller;

import com.example.restaurantmanagement.entity.Staff;
import com.example.restaurantmanagement.service.StaffService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class StaffController {

    private final StaffService service;

    public StaffController(StaffService service) {
        this.service = service;
    }

    // GET all
    @GetMapping
    public List<Staff> getAllStaff() {
        return service.getAllStaff();
    }

    // GET by ID
    @GetMapping("/{id}")
    public Staff getStaffById(@PathVariable String id) {
        return service.getStaffById(id);
    }

    // POST
    @PostMapping
    public Staff addStaff(
            @RequestBody Staff staff) {

        return service.addStaff(staff);
    }

    // PUT
    @PutMapping("/{id}")
    public Staff updateStaff(
            @PathVariable String id,
            @RequestBody Staff staff) {

        return service.updateStaff(id, staff);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteStaff(@PathVariable String id) {

        service.deleteStaff(id);

        return "Staff deleted successfully";
    }

    // JOIN
    @GetMapping("/restaurants")
    public List<Object[]> getStaffWithRestaurant() {

        return service.getStaffWithRestaurant();
    }

    // SUBQUERY
    @GetMapping("/chennai")
    public List<Object[]> getStaffInChennai() {

        return service.getStaffInChennai();
    }

    // CUSTOM QUERY
    @GetMapping("/role/{role}")
    public List<Staff> getStaffByRole(
            @PathVariable String role) {

        return service.getStaffByRole(role);
    }
}