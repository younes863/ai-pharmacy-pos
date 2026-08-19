package com.example.product_management.web;

import com.example.product_management.services.ISafetyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/safety")
@CrossOrigin(origins = "http://localhost:4200")
public class InteractionController {

    private final ISafetyService safetyService;

    // Injects MockSafetyService when in dev mode, GeminiSafetyService when in prod mode
    public InteractionController(ISafetyService safetyService) {
        this.safetyService = safetyService;
    }

    @PostMapping(value = "/check", produces = "text/plain")
    public String checkCartSafety(@RequestBody List<String> productNames) {
        return safetyService.checkInteractions(productNames);
    }
}