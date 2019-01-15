package ie.incidentapp.entities;

import javax.persistence.*;

@Entity
public class IncidentType {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
	private String description;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
