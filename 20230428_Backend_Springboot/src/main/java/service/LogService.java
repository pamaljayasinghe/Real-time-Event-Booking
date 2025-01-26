package service;

import config.LogWebSocketHandler;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class LogService {
    private final BlockingQueue<String> logQueue = new LinkedBlockingQueue<>();
    private final LogWebSocketHandler logWebSocketHandler;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");

    public LogService(LogWebSocketHandler logWebSocketHandler) {
        this.logWebSocketHandler = logWebSocketHandler;
    }

    @PostConstruct
    public void init() {
        Thread logConsumerThread = new Thread(() -> {
            try {
                while (true) {
                    String logMessage = logQueue.take();
                    String timestamp = LocalDateTime.now().format(formatter);
                    String formattedMessage = String.format("[%s] %s", timestamp, logMessage);
                    logWebSocketHandler.broadcast(formattedMessage);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.err.println("Log consumer thread interrupted: " + e.getMessage());
            }
        });
        logConsumerThread.setDaemon(true);
        logConsumerThread.start();
    }

    public void produceLog(String logMessage) {
        try {
            logQueue.put(logMessage);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Failed to enqueue log message: " + e.getMessage());
        }
    }
}