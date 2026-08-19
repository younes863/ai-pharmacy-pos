package com.example.product_management.dtos;

import lombok.Data;

@Data
public class ProductDTO {
    public Long id;
    private String name;
    private int stock;
    private double price;
    private Long categoryId;
    private String categoryName;
    private String barcode;
}
