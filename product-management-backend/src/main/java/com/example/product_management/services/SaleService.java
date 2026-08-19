package com.example.product_management.services;

import com.example.product_management.dtos.SaleRequestDTO;
import com.example.product_management.dtos.SaleResponseDTO;
import com.example.product_management.entities.Product;
import com.example.product_management.entities.Sale;
import com.example.product_management.entities.SaleItem;
import com.example.product_management.repositories.ProductRepository;
import com.example.product_management.repositories.SaleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public SaleResponseDTO processSale(SaleRequestDTO request) {
        Sale sale = new Sale();
        sale.setSaleDate(LocalDateTime.now());
        sale.setPaymentMethod(request.getPaymentMethod());
        List<SaleItem> saleItems = new ArrayList<>();
        double totalAmount = 0;

        for (SaleRequestDTO.SaleItemRequest itemDto : request.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found:" + itemDto.getProductId()));

            if (product.getStock() < itemDto.getQuantity()) {
                throw new RuntimeException("Insufficient stock for:" + product.getName());
            }

            product.setStock(product.getStock() - itemDto.getQuantity());
            productRepository.save(product);

            SaleItem saleItem = new SaleItem();
            saleItem.setProduct(product);
            saleItem.setQuantity(itemDto.getQuantity());
            saleItem.setPriceAtSale(product.getPrice());
            saleItems.add(saleItem);

            totalAmount += (product.getPrice() * itemDto.getQuantity());
        }

        sale.setItems(saleItems);
        sale.setTotalAmount(totalAmount);

        Sale savedSale = saleRepository.save(sale);

        return new SaleResponseDTO(
                savedSale.getId(),
                savedSale.getTotalAmount(),
                savedSale.getSaleDate(),
                "Sale completed successfully!"
        );
    }
}
