package vehicle_insurance_fraud;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin
public class ClaimController {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    // Test 
    @GetMapping("/test")
    public String test() {
        return "Claim Controller is working!";
    }

    // Main fraud analysis endpoint
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeClaim(@RequestBody Map<String, Object> claim) {

        try {

            // -----------------------------
            // 1. Send claim to Python ML
            // -----------------------------

            String json = objectMapper.writeValueAsString(claim);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://127.0.0.1:5000/predict"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            // -----------------------------
            // 2. Read ML response
            // -----------------------------

            Map<String, Object> mlResult =
                    objectMapper.readValue(response.body(), Map.class);

            // -----------------------------
            // 3. Rule Engine
            // -----------------------------

            List<String> flags = new ArrayList<>();

            if ("No".equalsIgnoreCase(
                    String.valueOf(claim.get("PoliceReportFiled")))) {
                flags.add("No Police Report");
            }

            if ("No".equalsIgnoreCase(
                    String.valueOf(claim.get("WitnessPresent")))) {
                flags.add("No Witness Present");
            }

            if ("External".equalsIgnoreCase(
                    String.valueOf(claim.get("AgentType")))) {
                flags.add("External Agent");
            }

            // -----------------------------
            // 4. Final response
            // -----------------------------

            Map<String, Object> result = new HashMap<>();

            result.put("prediction", mlResult.get("prediction"));
            result.put("fraud_probability",
                    mlResult.get("fraud_probability"));

            result.put("rule_engine_flags", flags);
            result.put("risk_indicator_count", flags.size());

            result.put(
                    "message",
                    "This result is statistical decision support and requires human investigation."
            );

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            Map<String, String> error = new HashMap<>();

            error.put("error", e.getMessage());

            return ResponseEntity.internalServerError().body(error);
        }
    }
}