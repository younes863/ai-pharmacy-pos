package com.example.product_management.services;


import com.example.product_management.dtos.CategoryDTO;
import com.example.product_management.entities.Category;
import com.example.product_management.entities.Product;
import com.example.product_management.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllActiveCategories() {
        return categoryRepository.findAllActive();
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category updateCategory(Category category){
        Category existingCategory = categoryRepository.findById(category.getId())
                .orElseThrow(() -> new RuntimeException("Update failed: Category not found."));
        existingCategory.setName(category.getName());
        return categoryRepository.save(existingCategory);

    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getProducts().isEmpty()) {
            throw new RuntimeException("Cannot delete: This category still contains products.");
        }
        category.setActive(false);
        categoryRepository.save(category);

    }

    public boolean existsById(Long id) {
        return categoryRepository.existsById(id);
    }

    public CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        return dto;
    }
}
