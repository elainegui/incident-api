package ie.incidentapp.repositories;

import org.springframework.data.repository.CrudRepository;

import ie.incidentapp.entities.Incident;

public interface IncidentRepository extends CrudRepository<Incident, String> {

}
