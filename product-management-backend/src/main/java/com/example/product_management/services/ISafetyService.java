package com.example.product_management.services;

import java.util.List;

public interface ISafetyService {
    String checkInteractions(List<String> productNames);
}
