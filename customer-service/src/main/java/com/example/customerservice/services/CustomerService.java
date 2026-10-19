package com.example.customerservice.services;

import com.example.customerservice.entities.Customer;
import com.example.customerservice.repositories.CustomerRepository;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    private CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    @McpTool(description = "Get All Customers")
    public List<Customer> customerList(){
        return  customerRepository.findAll();
    }
    @McpTool(description = "Find Customer by ID")
    public Customer findCustomerById (@McpToolParam(description = "The ID of the customer to find") Long id){
        return  customerRepository.findById(id).orElseThrow(()->
                new RuntimeException("Customer not found"));
    }
    @McpTool(description = "Save a new customer" )
    public Customer saveCustomer(@McpToolParam(description = "The customer to save(name,email)") Customer customer){
        return  customerRepository.save(customer);
    }
}
