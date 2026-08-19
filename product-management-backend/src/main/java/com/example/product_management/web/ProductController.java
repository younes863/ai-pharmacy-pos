package com.example.product_management.web;

import com.example.product_management.dtos.ProductDTO;
import com.example.product_management.entities.Product;
import com.example.product_management.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    @Autowired
    public ProductService productService;

    @GetMapping("/getAll")
    public ResponseEntity<List<ProductDTO>> getAllProducts(){

        List<Product> products = productService.getAllProducts();
        List<ProductDTO> dtos = products.stream()
                .map(productService::convertToDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/update")
    public ResponseEntity<Product> updateProduct(@RequestBody Product product){

        if (product.getId() == null || !productService.existsById(product.getId())) {
            return ResponseEntity.notFound().build();
        }
        Product updated = productService.updateProduct(product);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/add")
    public ResponseEntity<Product> addProduct(@RequestBody Product product){
        Product saved = productService.addProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id){
        if (!productService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String keyword){
        return productService.searchProducts(keyword);
    }

}
