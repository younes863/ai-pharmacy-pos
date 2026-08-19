package com.example.product_management.web;

import com.example.product_management.dtos.CategoryDTO;
import com.example.product_management.entities.Category;
import com.example.product_management.entities.Product;
import com.example.product_management.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryController {

    @Autowired
    public CategoryService categoryService;


    @GetMapping("/getAll")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<Category> categories = categoryService.getAllActiveCategories();

        List<CategoryDTO> dtos = categories.stream()
                .map(categoryService::convertToDTO)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/add")
    public ResponseEntity<Category> createCategory(@RequestBody  Category category) {
        Category saved = categoryService.createCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/update")
    public ResponseEntity<Category> updateCategory(@RequestBody Category category) {

        if (category.getId() == null || !categoryService.existsById(category.getId())) {
            return ResponseEntity.notFound().build();
        }
        Category updated = categoryService.updateCategory(category);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id){
        if (!categoryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


}

