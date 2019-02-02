package tools;

import static java.lang.String.format;

import java.util.concurrent.ThreadLocalRandom;

public class MonthIncidentDataGenerator {

	private static final float COORDINATES_MINIMUM_DELTA = -50;
	private static final float COORDINATES_MAXIMUM_DELTA = 50;
	private static final int NUMBER_OF_TYPES = 5;
	private static final int NUMBER_OF_MONTHS = 12;
	private final static String BASE_QUERY = "INSERT INTO `incident` (date, image, latitude, longitude, message, user_id, verified, type_id) VALUES ('%s', '', %f, %f, '%s', 0 , '\\0' , %d);";
	private final static String BASE_MESSAGE = "auto-generated incident %d";
	private final static String BASE_DATE = "2018-%s-01 00:00:00";
	private final static double BASE_LONGITUDE = -7.903531;
	private final static double BASE_LATITUDE = 53.418200;

	public static void main(String[] args) {
		int incidentCount = 1;
		for (int month = 1; month <= NUMBER_OF_MONTHS; month++) {
			int numberIterations = ThreadLocalRandom.current().nextInt(30, 100 + 1);
			String date = format(BASE_DATE, month);
			for (int iteration = 0; iteration < numberIterations; iteration++) {
				double latitude = BASE_LATITUDE + ThreadLocalRandom.current().nextDouble(COORDINATES_MINIMUM_DELTA,
						COORDINATES_MAXIMUM_DELTA + 1) / 1_000_000;
				double longitude = BASE_LONGITUDE + ThreadLocalRandom.current().nextDouble(COORDINATES_MINIMUM_DELTA,
						COORDINATES_MAXIMUM_DELTA + 1) / 1_000_000;
				String message = format(BASE_MESSAGE, incidentCount++);
				int typeId = ThreadLocalRandom.current().nextInt(0, NUMBER_OF_TYPES + 1);
				System.out.println(format(BASE_QUERY, date, latitude, longitude, message, typeId));
			}
		}
	}

}
