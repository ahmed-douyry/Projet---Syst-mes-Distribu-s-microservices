package com.example.ebankservice.controllers;

import com.example.ebankservice.entities.BankAccount;
import com.example.ebankservice.serivces.BankAccountService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class BankAccountController {
    private BankAccountService bankAccountService ;

    public BankAccountController(BankAccountService bankAccountService) {
        this.bankAccountService = bankAccountService;
    }
    @GetMapping("/bankAccounts")
    public List<BankAccount> bankAccountList(){
        return bankAccountService.bankAccountList();
    }
    @GetMapping("/bankAccounts/{id}")
    public BankAccount findBankAccountById(@PathVariable String id){
        return bankAccountService.findBankAccountById(id);
    }
    @PostMapping("/bankAccounts")
    public BankAccount saveBankAccount (@RequestBody  BankAccount bankAccount){
        return  bankAccountService.saveBankAccount(bankAccount);
    }
}
