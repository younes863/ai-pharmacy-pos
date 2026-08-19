package com.example.product_management.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiSafetyService implements ISafetyService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Override
    public String checkInteractions(List<String> productNames) {
        if (productNames == null || productNames.size() < 2) {
            return "SAFE";
        }

        RestTemplate restTemplate = new RestTemplate();
        String itemList = String.join(", ", productNames);

        String prompt = "You are a strict clinical safety API checking for drug interactions. " +
                "Analyze these medications: " + itemList + ". " +
                "You MUST reply with DANGEROUS if the list contains: " +
                "1. Duplicate drug classes (specifically NSAIDs taken together, such as BOTH Aspirin and Ibuprofen). " +
                "2. High-risk clinical interactions (like Warfarin + Aspirin).\n" +
                "Ignore routine, completely safe combinations like Metformin + Vitamin D.\n" +
                "If the list is completely safe, reply with: SAFE. " +
                "If there is any duplicate therapeutic class or dangerous interaction, reply with: DANGEROUS. " +
                "Provide exactly ONE word in your response: either SAFE or DANGEROUS. Do not write anything else.";

        Map<String, Object> textMap = Map.of("text", prompt);
        Map<String, Object> partsMap = Map.of("parts", List.of(textMap));
        Map<String, Object> contentsMap = Map.of("contents", List.of(partsMap));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(contentsMap, headers);

        try {
            if (apiKey == null || apiKey.trim().isEmpty()) {
                return "SAFE";
            }

            String fullUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=" + apiKey.trim();

            ResponseEntity<Map> response = restTemplate.postForEntity(fullUrl, requestEntity, Map.class);

            if (response.getBody() != null && response.getBody().containsKey("candidates")) {
                List<?> candidates = (List<?>) response.getBody().get("candidates");
                if (!candidates.isEmpty()) {
                    Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
                    Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
                    List<?> parts = (List<?>) content.get("parts");
                    Map<?, ?> firstPart = (Map<?, ?>) parts.get(0);

                    String rawResult = firstPart.get("text").toString();
                    String cleanResult = rawResult.trim().toUpperCase().replaceAll("[^A-Z]", "");

                    if (cleanResult.contains("DANGEROUS")) {
                        return "DANGEROUS";
                    }
                }
            }
            return "SAFE";

        } catch (HttpClientErrorException e) {
            return "SAFE";
        } catch (Exception e) {
            return "SAFE";
        }
    }
}