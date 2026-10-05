package com.example.customerservice.controllers;

import com.example.customerservice.entities.Customer;
import com.example.customerservice.repositories.CustomerRepository;
import com.example.customerservice.services.CustomerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CustomerController {
    private CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }
    @GetMapping("/customers")
    public List<Customer> customerList(){
        return  customerService.customerList();
    }
    @GetMapping("/customers/{id}")
    public Customer findCustomerById (@PathVariable  Long id){
        return  customerService.findCustomerById(id);
    }
    @PostMapping("/customers")
    public Customer saveCustomer(@RequestBody  Customer customer){
        return  customerService.saveCustomer(customer);
    }

}
