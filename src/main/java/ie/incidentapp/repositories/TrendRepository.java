package ie.incidentapp.repositories;

import org.springframework.data.repository.CrudRepository;

import ie.incidentapp.entities.Trend;

public interface TrendRepository extends CrudRepository<Trend, String> {

	//
	// @Query(value = "SELECT id," + " date," + " image," + " latitude," + "
	// longitude,"
	// + " message," + " user_id," + " verified," + " type_id " + "FROM ("
	// + " SELECT *," + " ( ( ( Acos(Sin(( :latitude * Pi() / 180 )) * "
	// + " Sin( ( incident.latitude * Pi() / 180 )) +"
	// + " Cos( ( :latitude * Pi() / 180 )) * "
	// + " Cos( ( incident.latitude * Pi() / 180 )) * "
	// + " Cos( ( ( :longitude - incident.longitude ) * "
	// + " Pi() / 180 )) ) ) * 180 / Pi() ) * 60 * 1.1515 * 1609.344 ) AS
	// distance_in_meters"
	// + " FROM incident_db.incident AS incident"
	// + " HAVING distance_in_meters < :distance_in_meters) AS temp", nativeQuery =
	// true)
	// List<Incident> findByRadiusInMeters(@Param("latitude") double latitude,
	// @Param("longitude") double longitude,
	// @Param("distance_in_meters") long distanceInMeters);

}