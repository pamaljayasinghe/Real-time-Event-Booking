package controller;

import Model.Ticket;
import service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    /**
     * Releases a ticket.
     *
     * @param ticket The ticket to release.
     * @return The released ticket.
     */
    @PostMapping("/release")
    public Ticket releaseTicket(@RequestBody Ticket ticket) {
        return ticketService.releaseTicket(ticket);
    }

    /**
     * Purchases a ticket by ID.
     *
     * @param id The ID of the ticket to purchase.
     * @return The purchased ticket or null if unavailable.
     */
    @PostMapping("/purchase/{id}")
    public Ticket purchaseTicket(@PathVariable Long id) {
        return ticketService.purchaseTicket(id);
    }

    /**
     * Retrieves all tickets.
     *
     * @return A list of all tickets.
     */
    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }
}

