package com.example.ebankservice.entities;

import com.example.ebankservice.models.Customer;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import lombok.*;
import tools.jackson.databind.DatabindException;

import java.util.Date;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankAccount {
    @Id
    private String id;
    private Date createdAt;
    private double balance;
    private String type ;
    private  Long customerID;
    @Transient
    private Customer customer;

}
