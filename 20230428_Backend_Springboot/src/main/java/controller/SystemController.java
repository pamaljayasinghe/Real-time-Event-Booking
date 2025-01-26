package controller;

import org.springframework.web.bind.annotation.*;
import service.TicketPoolManager;
import service.VendorManager;
import service.CustomerManager;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/system")
@CrossOrigin(origins = "http://localhost:5173")
public class SystemController {
    private final TicketPoolManager ticketPoolManager;
    private final VendorManager vendorManager;
    private final CustomerManager customerManager;

    public SystemController(TicketPoolManager ticketPoolManager,
                            VendorManager vendorManager,
                            CustomerManager customerManager) {
        this.ticketPoolManager = ticketPoolManager;
        this.vendorManager = vendorManager;
        this.customerManager = customerManager;
    }

    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> startSystem(@RequestBody SystemConfig config) {
        try {
            ticketPoolManager.startSystem(config.maxTickets, config.releaseRate, config.purchaseRate);

            // Initialize vendors and customers
            for (int i = 0; i < config.vendors; i++) {
                vendorManager.addVendor();
            }
            for (int i = 0; i < config.customers; i++) {
                customerManager.addCustomer();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "System started successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/stop")
    public ResponseEntity<Map<String, Object>> stopSystem() {
        try {
            ticketPoolManager.stopSystem();
            vendorManager.stopAllVendors();
            customerManager.stopAllCustomers();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "System stopped successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/vendor/add")
    public ResponseEntity<Map<String, Object>> addVendor() {
        try {
            vendorManager.addVendor();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("vendorCount", vendorManager.getVendorCount());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/vendor/remove")
    public ResponseEntity<Map<String, Object>> removeVendor() {
        try {
            vendorManager.removeVendor();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("vendorCount", vendorManager.getVendorCount());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/customer/add")
    public ResponseEntity<Map<String, Object>> addCustomer() {
        try {
            customerManager.addCustomer();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("customerCount", customerManager.getCustomerCount());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/customer/remove")
    public ResponseEntity<Map<String, Object>> removeCustomer() {
        try {
            customerManager.removeCustomer();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("customerCount", customerManager.getCustomerCount());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<SystemStatus> getStatus() {
        try {
            SystemStatus status = new SystemStatus();
            status.running = ticketPoolManager.isRunning();
            status.currentTickets = ticketPoolManager.getCurrentPoolSize();
            status.maxTickets = ticketPoolManager.getMaxTickets();
            status.vendors = vendorManager.getVendorCount();
            status.customers = customerManager.getCustomerCount();
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}

class SystemConfig {
    public int maxTickets;
    public int releaseRate;
    public int purchaseRate;
    public int vendors;
    public int customers;
}

class SystemStatus {
    public boolean running;
    public int currentTickets;
    public int maxTickets;
    public int vendors;
    public int customers;
}