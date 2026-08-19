package com.example.product_management.services;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


public class MockSafetyService implements ISafetyService {

    @Override
    public String checkInteractions(List<String> productNames) {
        if (productNames == null || productNames.size() < 2) {
            return "SAFE";
        }

        List<String> normalized = productNames.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        boolean hasAspirin = normalized.stream().anyMatch(name -> name.contains("aspirin"));
        boolean hasIbuprofen = normalized.stream().anyMatch(name -> name.contains("ibuprofen"));

        if (hasAspirin && hasIbuprofen) {
            System.out.println("MOCK_SAFETY_SERVICE: Aspirin + Ibuprofen detected -> DANGEROUS");
            return "DANGEROUS";
        }

        System.out.println("MOCK_SAFETY_SERVICE: Cart safe -> SAFE");
        return "SAFE";
    }
}