package com.example.product_management.dtos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
public class SaleRequestDTO {
    private String paymentMethod;
    private List<SaleItemRequest> items;
 @Getter@Setter
    public static class SaleItemRequest {
        private Long productId;
        private Integer quantity;
    }
}
