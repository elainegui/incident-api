package ie.incidentapp.services;

import ie.incidentapp.entities.Incident;
import ie.incidentapp.entities.IncidentTypeEnum;
import ie.incidentapp.entities.Trend;
import ie.incidentapp.repositories.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class TrendService {

    @Autowired
    private IncidentRepository incidentRepository;

    private DateFormat dateFormatter = new SimpleDateFormat("MM-yyyy");

    public List<Trend> findAllFromLast12Months(String country, String state, String city) {
        List<Incident> allIncidentsFromLast12Months = incidentRepository.findAllFromLast12Months(country, state, city);

        // organize the incidents per type description and per date (month), so their respective totals can be find in the next step
        Map<String, Map<String, Long>> incidentCounterByTypeAndDate = initializeMap(); //ex. {Car Crash,{december,0}

        //for every incident found, increment the respective counter
        for (Incident incident: allIncidentsFromLast12Months) {
            String monthYear = dateFormatter.format(incident.getDate());
            long currentCountForTypeAndDate = incidentCounterByTypeAndDate.get(incident.getType().getDescription()).get(monthYear);
            incidentCounterByTypeAndDate.get(incident.getType().getDescription()).put(monthYear, currentCountForTypeAndDate + 1);
        }

        // aggregate the information as Trends, to be sent as response
        List<Trend> trends = new ArrayList<>();
        for (Map.Entry<String, Map<String, Long>> incidentTypeDescriptionEntry : incidentCounterByTypeAndDate.entrySet()) {
            Trend trend = new Trend(incidentTypeDescriptionEntry.getKey());
            Map<String, Long> countersPerDate = incidentTypeDescriptionEntry.getValue();
            for (Map.Entry<String, Long> countersPerDateEntry : countersPerDate.entrySet()) {
                String monthYear = countersPerDateEntry.getKey();
                Long totalOfIncidents = countersPerDateEntry.getValue();
                trend.getTotalPerMonth().put(monthYear, totalOfIncidents);
            }
            trends.add(trend);
        }
        return trends;
    }

    private Map<String, Map<String, Long>> initializeMap() {
        Map<String, Map<String, Long>> incidentCounterByTypeAndDate = new LinkedHashMap<>();//{incident type description ,n. incidents}
        List<String> past12Months = buildListOfPast12Months(); // list of all past 12 months
        long initialIncidentCount = 0;
        for (IncidentTypeEnum incidentTypeEnum: IncidentTypeEnum.values()) {
            //for each incident type, creates an empty map to store the months and initial incident count
            incidentCounterByTypeAndDate.put(incidentTypeEnum.getIncidentType().getDescription(), new LinkedHashMap<>()); //{incident type description , {key,value}}
            for (String month: past12Months) {
                //for each month, add the initial incident count
                incidentCounterByTypeAndDate.get(incidentTypeEnum.getIncidentType().getDescription()).put(month, initialIncidentCount);
                //get the key(incidentTypeEnum.getIncidentType().getDescription()) and include the value a new hash map (month, initialIncidentCount)
                //ex. {Car Crash,{december,1}
            }
        }
        return incidentCounterByTypeAndDate;
    }

    //build an enpty arry list of the past 12 months
    private List<String> buildListOfPast12Months() {
        List<String> past12Months = new ArrayList<>();
        SimpleDateFormat monthDate = new SimpleDateFormat("MM-yyyy");
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MONTH, -11); // back 11 months from current date
        for (int monthIndex = 1; monthIndex <= 12; monthIndex++) {
            String monthName = monthDate.format(cal.getTime());
            past12Months.add(monthName);
            cal.add(Calendar.MONTH, +1);
        }
        return past12Months;
    }

}
