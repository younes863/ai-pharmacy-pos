package com.example.product_management.dtos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
public class SaleResponseDTO {
    private Long id;

    public SaleResponseDTO(Long id, Double totalAmount, LocalDateTime saleDate, String message) {
        this.id = id;
        this.totalAmount = totalAmount;
        this.saleDate = saleDate;
        this.message = message;
    }

    private Double totalAmount;
    private LocalDateTime saleDate;
    private String message;
}
