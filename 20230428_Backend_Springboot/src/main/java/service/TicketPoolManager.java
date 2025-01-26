package service;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import org.springframework.stereotype.Service;
import Model.Ticket;

@Service
public class TicketPoolManager {
    private final BlockingQueue<Ticket> ticketPool = new LinkedBlockingQueue<>();
    private final LogService logService;
    private volatile boolean isRunning = false;
    private int maxTickets = 150;
    private int releaseRate = 4;
    private int purchaseRate = 3;

    public TicketPoolManager(LogService logService) {
        this.logService = logService;
    }

    public void startSystem(int maxTickets, int releaseRate, int purchaseRate) {
        this.maxTickets = maxTickets;
        this.releaseRate = releaseRate;
        this.purchaseRate = purchaseRate;
        this.isRunning = true;
        ticketPool.clear();
        logService.produceLog("System started with configuration: Max Tickets=" + maxTickets +
                ", Release Rate=" + releaseRate + "/s, Purchase Rate=" + purchaseRate + "/s");
    }

    public void stopSystem() {
        this.isRunning = false;
        int remainingTickets = ticketPool.size();
        ticketPool.clear();
        logService.produceLog("System stopped. Cleared " + remainingTickets + " remaining tickets");
    }

    public boolean isRunning() {
        return isRunning;
    }

    public int getCurrentPoolSize() {
        return ticketPool.size();
    }

    public boolean releaseTicket(Ticket ticket) {
        if (!isRunning || ticketPool.size() >= maxTickets) {
            logService.produceLog("Failed to release ticket: " +
                    (isRunning ? "Pool is full (" + ticketPool.size() + "/" + maxTickets + ")"
                            : "System is not running"));
            return false;
        }

        try {
            ticketPool.put(ticket);
            logService.produceLog("Ticket released: " + ticket.getSeatNumber() +
                    " (Pool: " + ticketPool.size() + "/" + maxTickets + ")");
            return true;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logService.produceLog("Error releasing ticket: " + e.getMessage());
            return false;
        }
    }

    public Ticket purchaseTicket() {
        if (!isRunning) {
            logService.produceLog("Cannot purchase ticket: System is not running");
            return null;
        }

        try {
            Ticket ticket = ticketPool.poll();
            if (ticket != null) {
                logService.produceLog("Ticket purchased: " + ticket.getSeatNumber() +
                        " (Pool: " + ticketPool.size() + "/" + maxTickets + ")");
            } else {
                logService.produceLog("Failed to purchase ticket: Pool is empty");
            }
            return ticket;
        } catch (Exception e) {
            logService.produceLog("Error purchasing ticket: " + e.getMessage());
            return null;
        }
    }

    public int getReleaseRate() {
        return releaseRate;
    }

    public int getPurchaseRate() {
        return purchaseRate;
    }

    public int getMaxTickets() {
        return maxTickets;
    }
}