package service;

import org.springframework.stereotype.Service;
import java.util.concurrent.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerManager {
    private final TicketPoolManager ticketPoolManager;
    private final LogService logService;
    private final List<ScheduledFuture<?>> customerTasks = new ArrayList<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(10);
    private volatile int customerCount = 0;

    public CustomerManager(TicketPoolManager ticketPoolManager, LogService logService) {
        this.ticketPoolManager = ticketPoolManager;
        this.logService = logService;
    }

    public synchronized void addCustomer() {
        if (ticketPoolManager.isRunning()) {
            ScheduledFuture<?> task = scheduler.scheduleAtFixedRate(() -> {
                if (ticketPoolManager.isRunning()) {
                    if (ticketPoolManager.purchaseTicket() == null) {
                        logService.produceLog("Failed to purchase ticket: Pool is empty or system stopped");
                    }
                }
            }, 0, 1000 / ticketPoolManager.getPurchaseRate(), TimeUnit.MILLISECONDS);
            customerTasks.add(task);
            customerCount++;
            logService.produceLog("New customer added. Total customers: " + customerCount);
        }
    }

    public synchronized void removeCustomer() {
        if (!customerTasks.isEmpty() && customerCount > 0) {
            ScheduledFuture<?> task = customerTasks.remove(customerTasks.size() - 1);
            task.cancel(false);
            customerCount--;
            logService.produceLog("Customer removed. Total customers: " + customerCount);
        }
    }

    public synchronized void stopAllCustomers() {
        customerTasks.forEach(task -> task.cancel(false));
        customerTasks.clear();
        customerCount = 0;
    }

    public int getCustomerCount() {
        return customerCount;
    }
}