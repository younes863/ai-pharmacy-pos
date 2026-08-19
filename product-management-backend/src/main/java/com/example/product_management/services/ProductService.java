package com.example.product_management.services;


import com.example.product_management.dtos.ProductDTO;
import com.example.product_management.entities.Category;
import com.example.product_management.entities.Product;
import com.example.product_management.repositories.CategoryRepository;
import com.example.product_management.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    public ProductRepository productRepository;
    @Autowired
    public CategoryRepository categoryRepository;

    public Product addProduct(Product product){
        if (product.getStock() <= 0) {
            throw new IllegalArgumentException("Stock must be positive");
        }
        if (product.getCategory() == null || product.getCategory().getId() == null) {
            throw new IllegalArgumentException(("Category is required"));
        }
        Category category = categoryRepository.findById(product.getCategory().getId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        product.setCategory(category);

        return productRepository.save(product);
    }

    public List<Product> getAllProducts(){

        List<Product> products = productRepository.findAll();
        return products;
    }

    public Product updateProduct(Product product){
        Product existingProduct = productRepository.findById(product.getId())
                .orElseThrow(() -> new RuntimeException("Update failed: Product not found."));
        existingProduct.setName(product.getName());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setStock(product.getStock());
        existingProduct.setBarcode(product.getBarcode());

        return productRepository.save(existingProduct);

    }

    public void deleteProduct(Long id){
            productRepository.deleteById(id);
    }

    public List<Product> searchProducts (String keyword) {
        if (keyword == null || keyword.isEmpty()){
            return productRepository.findAll();
        }else {
            return  productRepository.findByNameContainingIgnoreCase(keyword);
        }
    }

    public boolean existsById(Long id) {
        return productRepository.existsById(id);
    }

    public ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setStock(product.getStock());
        dto.setPrice(product.getPrice());
        dto.setBarcode(product.getBarcode());

        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }

        return dto;
    }
}
