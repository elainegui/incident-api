package ie.incidentapp.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import ie.incidentapp.entities.Incident;

public interface IncidentRepository extends CrudRepository<Incident, String> {

    @Query(value = "SELECT id, date, image, latitude, longitude, country, state, city, "
            + "       message,       user_id,       verified,       type_id FROM   ("
            + "       SELECT *,               ( ( ( Acos(Sin(( :latitude * Pi() / 180 )) * "
            + "               Sin( ( incident.latitude * Pi() / 180 )) +"
            + "               Cos( ( :latitude * Pi() / 180 )) * "
            + "               Cos( ( incident.latitude * Pi() / 180 )) * "
            + "               Cos( ( ( :longitude - incident.longitude ) * "
            + "               Pi() / 180 )) ) ) * 180 / Pi() ) * 60 * 1.1515 * 1609.344 ) AS distance_in_meters"
            + "        FROM   incident_db.incident AS incident"
            + "        HAVING distance_in_meters < :distance_in_meters) AS temp", nativeQuery = true)
    List<Incident> findByRadiusInMeters(@Param("latitude") double latitude, @Param("longitude") double longitude,
                                        @Param("distance_in_meters") long distanceInMeters);

    @Query(value = "SELECT incident.*, incident_type.description FROM " +
            "incident inner join incident_type on type_id = incident_type.id " +
            "WHERE date BETWEEN (NOW() - INTERVAL 12 MONTH) AND NOW() " +
            "and country = :country and state = :state and city = :city " +
            "order by date, type_id", nativeQuery = true)
    List<Incident> findAllFromLast12Months(@Param("country") String country, @Param("state") String state, @Param("city") String city);

    @Query(value = "select distinct lower(country) from incident order by 1", nativeQuery = true)
    List<String> findAllCountries();

    @Query(value = "select distinct lower(state) from incident where lower(country) = lower(:country) order by 1", nativeQuery = true)
    List<String> findAllStatesByCountry(@Param("country") String country);

    @Query(value = "select distinct lower(city) from incident where lower(country) = lower(:country) and lower(state) = lower(:state) order by 1", nativeQuery = true)
    List<String> findAllCitiesByState(@Param("country") String country, @Param("state") String state);
}
