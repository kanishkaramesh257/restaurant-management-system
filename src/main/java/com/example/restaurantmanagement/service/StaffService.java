package com.example.restaurantmanagement.service;

import com.example.restaurantmanagement.entity.Staff;
import com.example.restaurantmanagement.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffService {

    private final StaffRepository repository;

    public StaffService(StaffRepository repository) {
        this.repository = repository;
    }

    // CRUD

    public List<Staff> getAllStaff() {
        return repository.findAll();
    }

    public Staff getStaffById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Staff addStaff(Staff staff) {
        return repository.save(staff);
    }

    public Staff updateStaff(String id, Staff staff) {
        staff.setStaffId(id);
        return repository.save(staff);
    }

    public void deleteStaff(String id) {
        repository.deleteById(id);
    }

    // Custom query

    public List<Staff> getStaffByRole(String role) {
        return repository.findByRole(role);
    }

    // JOIN

    public List<Object[]> getStaffWithRestaurant() {
        return repository.getStaffWithRestaurant();
    }

    // Subquery

    public List<Object[]> getStaffInChennai() {
        return repository.getStaffInChennai();
    }
}