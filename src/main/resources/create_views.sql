CREATE OR REPLACE VIEW `incident_db`.`incident_trend_past_12_months` AS
	SELECT 
		CONCAT(incident_month, '_', incident_year, '_', type_id) AS id,
		CONCAT(incident_month, '/', incident_year) AS month_and_year,
		DATE_FORMAT(STR_TO_DATE(CONCAT(incident_month, '/', incident_year), '%m/%Y'),'%b') AS month_short_name,
		type_id,
		description,
		total_of_incidents_per_type
	FROM
		(SELECT 
			MONTH(date) AS incident_month,
			YEAR(date) AS incident_year,
			type_id, 
			description,
			COUNT(*) AS total_of_incidents_per_type
		FROM
			incident_db.incident inner join incident_db.incident_type on incident.type_id = incident_type.id
		WHERE
			date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
		GROUP BY incident_month , incident_year, type_id) 
		AS incidents_per_month_temp_table
	ORDER BY type_id, incident_year, incident_month 