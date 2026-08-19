package com.example.product_management.web;

import com.example.product_management.dtos.SaleRequestDTO;
import com.example.product_management.dtos.SaleResponseDTO;
import com.example.product_management.entities.Sale;
import com.example.product_management.services.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sales")
@CrossOrigin(origins = "http://localhost:4200")
public class SaleController {

    @Autowired
    private SaleService saleService;

    @PostMapping
    public ResponseEntity<?> createSale(@RequestBody SaleRequestDTO requestDTO) {
        SaleResponseDTO responseDTO = saleService.processSale(requestDTO);
        return ResponseEntity.ok(responseDTO);
    }
}
