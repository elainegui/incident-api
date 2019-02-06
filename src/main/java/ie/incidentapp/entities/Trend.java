package ie.incidentapp.entities;

import java.util.HashMap;
import java.util.Map;

public class Trend {

    private IncidentType incidentType;
    private Map<String, Long> totalPerMonth;

    public Trend(IncidentType incidentType) {
        this.incidentType = incidentType;
        totalPerMonth = new HashMap<>();
    }

    public IncidentType getIncidentType() {
        return incidentType;
    }

    public void setIncidentType(IncidentType incidentType) {
        this.incidentType = incidentType;
    }

    public Map<String, Long> getTotalPerMonth() {
        return totalPerMonth;
    }

    public void setTotalPerMonth(Map<String, Long> totalPerMonth) {
        this.totalPerMonth = totalPerMonth;
    }
}
