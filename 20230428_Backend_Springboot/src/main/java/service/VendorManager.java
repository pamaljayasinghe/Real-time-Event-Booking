package service;

import Model.Vendor;
import org.springframework.stereotype.Service;
import java.util.concurrent.*;
import java.util.ArrayList;
import java.util.List;
import Model.Ticket;

@Service
public class VendorManager {
    private final TicketPoolManager ticketPoolManager;
    private final LogService logService;
    private final List<ScheduledFuture<?>> vendorTasks = new ArrayList<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(10);
    private volatile int vendorCount = 0;

    public VendorManager(TicketPoolManager ticketPoolManager, LogService logService) {
        this.ticketPoolManager = ticketPoolManager;
        this.logService = logService;
    }

    public synchronized void addVendor() {
        if (ticketPoolManager.isRunning()) {
            ScheduledFuture<?> task = scheduler.scheduleAtFixedRate(() -> {
                if (ticketPoolManager.isRunning()) {
                    Ticket ticket = new Ticket("SEAT-" + System.currentTimeMillis(), true);
                    boolean released = ticketPoolManager.releaseTicket(ticket);
                    if (!released) {
                        logService.produceLog("Failed to release ticket: Pool is full or system stopped");
                    }
                }
            }, 0, 1000 / ticketPoolManager.getReleaseRate(), TimeUnit.MILLISECONDS);
            vendorTasks.add(task);
            vendorCount++;
            logService.produceLog("New vendor added. Total vendors: " + vendorCount);
        }
    }

    public synchronized void removeVendor() {
        if (!vendorTasks.isEmpty() && vendorCount > 0) {
            ScheduledFuture<?> task = vendorTasks.remove(vendorTasks.size() - 1);
            task.cancel(false);
            vendorCount--;
            logService.produceLog("Vendor removed. Total vendors: " + vendorCount);
        }
    }

    public synchronized void stopAllVendors() {
        vendorTasks.forEach(task -> task.cancel(false));
        vendorTasks.clear();
        vendorCount = 0;
    }

    public int getVendorCount() {
        return vendorCount;
    }
}