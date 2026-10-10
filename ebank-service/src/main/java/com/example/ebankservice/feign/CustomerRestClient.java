package com.example.ebankservice.feign;

import com.example.ebankservice.models.Customer;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "Customer-service")

public interface CustomerRestClient {
    @GetMapping("/customers/{id}")
    @CircuitBreaker(name = "customerService", fallbackMethod = "getCustomerByIdFallback")
    Customer getCustomerById(@PathVariable Long id);
    default  Customer getCustomerByIdFallback(Long id, Throwable throwable){
        return new Customer(id, "Unknown", "Unkown");
    }

}
