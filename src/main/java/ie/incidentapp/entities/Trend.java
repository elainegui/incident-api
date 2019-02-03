package ie.incidentapp.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity(name = "incident_trend_past_12_months")
public class Trend {

	@Id
	private String id;
	@Column(name = "month_and_year")
	private String monthYear;
	@Column(name = "month_short_name")
	private String monthShortName;
	@Column(name = "type_id")
	private int typeId;
	@Column(name = "description")
	private String typeDescription;
	@Column(name = "total_of_incidents_per_type")
	private long totalOfIncidents;

	public String getMonthYear() {
		return monthYear;
	}

	public void setMonthYear(String monthYear) {
		this.monthYear = monthYear;
	}

	public String getMonthShortName() {
		return monthShortName;
	}

	public void setMonthShortName(String monthShortName) {
		this.monthShortName = monthShortName;
	}

	public int getTypeId() {
		return typeId;
	}

	public void setTypeId(int typeId) {
		this.typeId = typeId;
	}

	public String getTypeDescription() {
		return typeDescription;
	}

	public void setTypeDescription(String typeDescription) {
		this.typeDescription = typeDescription;
	}

	public long getTotalOfIncidents() {
		return totalOfIncidents;
	}

	public void setTotalOfIncidents(long totalOfIncidents) {
		this.totalOfIncidents = totalOfIncidents;
	}

}
