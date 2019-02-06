package ie.incidentapp.entities;

import java.util.LinkedHashMap;
import java.util.Map;

public class Trend {

    private String incidentTypeDescription;
    private Map<String, Long> totalPerMonth;

    public Trend(String incidentTypeDescription) {
        this.incidentTypeDescription = incidentTypeDescription;
        totalPerMonth = new LinkedHashMap<>();
    }

    public String getIncidentTypeDescription() {
        return incidentTypeDescription;
    }

    public void setIncidentTypeDescription(String incidentTypeDescription) {
        this.incidentTypeDescription = incidentTypeDescription;
    }

    public Map<String, Long> getTotalPerMonth() {
        return totalPerMonth;
    }

    public void setTotalPerMonth(Map<String, Long> totalPerMonth) {
        this.totalPerMonth = totalPerMonth;
    }
}
