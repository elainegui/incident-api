package ie.incidentapp.entities;

public enum IncidentTypeEnum {
    CAR_CRASH(new IncidentType(0, "Car Crash")),
    FAULTY_TRAFFIC_LIGHT(new IncidentType(1, "Faulty Traffic Light")),
    FAULTY_STREET_LIGHT(new IncidentType(2, "Faulty Street Light")),
    SNITCHING(new IncidentType(3, "Snitching")),
    ROBBERY(new IncidentType(4, "Robbery")),
    ROAD_WORK(new IncidentType(5, "Road Work"));

    private IncidentType incidentType;

    IncidentTypeEnum(IncidentType incidentType) {
        this.incidentType = incidentType;
    }

    public IncidentType getIncidentType() {
        return incidentType;
    }
}
