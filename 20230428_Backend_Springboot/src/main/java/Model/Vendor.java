package Model;

public class Vendor {
    private Long id;
    private String name;

    public Vendor() {}

    public Vendor(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}