package ie.incidentapp.services;

import ie.incidentapp.entities.Incident;
import ie.incidentapp.entities.IncidentType;
import ie.incidentapp.entities.Trend;
import ie.incidentapp.repositories.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TrendService {

    @Autowired
    private IncidentRepository incidentRepository;

    private DateFormat dateFormatter = new SimpleDateFormat("MM-yyyy");

    public List<Trend> findAllFromLast12Months() {
        List<Incident> allIncidentsFromLast12Months = incidentRepository.findAllFromLast12Months();

        Map<IncidentType, Map<String, Long>> incidentCounterByTypeAndDate = new HashMap<>();
        for (Incident incident: allIncidentsFromLast12Months) {
            String monthYear = dateFormatter.format(incident.getDate());
            initializeMapIfNeeded(incidentCounterByTypeAndDate, monthYear, incident);
            long currentCountForTypeAndDate = incidentCounterByTypeAndDate.get(incident.getType()).get(monthYear);
            incidentCounterByTypeAndDate.get(incident.getType()).put(monthYear, currentCountForTypeAndDate + 1);
        }

        List<Trend> trends = new ArrayList<>();
        for (Map.Entry<IncidentType, Map<String, Long>> incidentTypeEntry : incidentCounterByTypeAndDate.entrySet()) {
            Trend trend = new Trend(incidentTypeEntry.getKey());
            Map<String, Long> countersPerDate = incidentTypeEntry.getValue();
            for (Map.Entry<String, Long> countersPerDateEntry : countersPerDate.entrySet()) {
                String monthYear = countersPerDateEntry.getKey();
                Long totalOfIncidents = countersPerDateEntry.getValue();
                trend.getTotalPerMonth().put(monthYear, totalOfIncidents);
            }
            trends.add(trend);
        }
        return trends;
    }

    private void initializeMapIfNeeded(Map<IncidentType, Map<String, Long>> incidentCounterByTypeAndDate, String monthYear, Incident incident) {
        if (!incidentCounterByTypeAndDate.containsKey(incident.getType())) {
            incidentCounterByTypeAndDate.put(incident.getType(), new HashMap<>());
        }
        if (!incidentCounterByTypeAndDate.get(incident.getType()).containsKey(monthYear)) {
            incidentCounterByTypeAndDate.get(incident.getType()).put(monthYear, 0L);
        }
    }
}
