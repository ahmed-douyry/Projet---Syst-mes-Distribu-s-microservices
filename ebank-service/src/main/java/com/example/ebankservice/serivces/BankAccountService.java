package com.example.ebankservice.serivces;

import com.example.ebankservice.entities.BankAccount;
import com.example.ebankservice.feign.CustomerRestClient;
import com.example.ebankservice.models.Customer;
import com.example.ebankservice.repositories.BankAccountRepository;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class BankAccountService {
    private final BankAccountRepository bankAccountRepository ;
    private final CustomerRestClient customerRestClient;

    public BankAccountService(BankAccountRepository bankAccountRepository, CustomerRestClient customerRestClient) {
        this.bankAccountRepository = bankAccountRepository;
        this.customerRestClient = customerRestClient;
    }
    @McpTool(description = "get all Bank accounts")
    public List<BankAccount> bankAccountList(){
        return  bankAccountRepository.findAll();
    }
    @McpTool(description = "find a Bank account by its ID")
    public BankAccount findBankAccountById(@McpToolParam(description = "The ID of the Bank account to find") String id){
        BankAccount bankAccount = bankAccountRepository.findById(id).
                orElseThrow(() -> new RuntimeException("account not found"));
        bankAccount.setCustomer(customerRestClient.getCustomerById(bankAccount.getCustomerID()));
        return  bankAccount;
    }
    @McpTool(description = "save a new Bank account")
    public BankAccount saveBankAccount (BankAccount bankAccount){
        try {
            Customer customer = customerRestClient.getCustomerById(bankAccount.getCustomerID());
            bankAccount.setId(UUID.randomUUID().toString());
            bankAccount.setCreatedAt(new Date());
            return  bankAccountRepository.save(bankAccount);
        } catch (Exception e) {
            throw new RuntimeException( e.getMessage());
        }
    }
}
