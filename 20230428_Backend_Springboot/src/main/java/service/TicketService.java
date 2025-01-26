// src/main/java/service/TicketService.java
package service;

import java.util.Optional;
import Model.Ticket;
import repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private LogService logService; // Inject LogService

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");

    // Release a ticket
    public Ticket releaseTicket(Ticket ticket) {
        ticket.setAvailable(true);
        Ticket savedTicket = ticketRepository.save(ticket);
        sendLog("Released ticket: " + savedTicket.getSeatNumber());
        return savedTicket;
    }

    // Purchase a ticket
    public Ticket purchaseTicket(Long ticketId) {
        Optional<Ticket> optionalTicket = ticketRepository.findByIdAndAvailable(ticketId, true);
        if (optionalTicket.isPresent()) {
            Ticket ticket = optionalTicket.get();
            ticket.setAvailable(false);
            Ticket savedTicket = ticketRepository.save(ticket);
            sendLog("Purchased ticket: " + savedTicket.getSeatNumber());
            return savedTicket;
        }
        sendLog("Failed to purchase ticket with ID: " + ticketId + " (not available)");
        return null;
    }

    // Get all tickets
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Helper method to send log messages
    private void sendLog(String message) {
        String timestamp = LocalDateTime.now().format(formatter);
        String logMessage = "[" + timestamp + "] " + message;
        logService.produceLog(logMessage);
    }
}
