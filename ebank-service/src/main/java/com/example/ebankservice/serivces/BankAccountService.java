package com.example.ebankservice.serivces;

import com.example.ebankservice.entities.BankAccount;
import com.example.ebankservice.repositories.BankAccountRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class BankAccountService {
    private final BankAccountRepository bankAccountRepository ;

    public BankAccountService(BankAccountRepository bankAccountRepository) {
        this.bankAccountRepository = bankAccountRepository;
    }
    public List<BankAccount> bankAccountList(){
        return bankAccountRepository.findAll();
    }
    public BankAccount findBankAccountById(String id){
        return bankAccountRepository.findById(id).
                orElseThrow(()->new RuntimeException("account not found"));
    }
    public BankAccount saveBankAccount (BankAccount bankAccount){
        bankAccount.setId(UUID.randomUUID().toString());
        bankAccount.setCreatedAt(new Date());
        return  bankAccountRepository.save(bankAccount);
    }
}
