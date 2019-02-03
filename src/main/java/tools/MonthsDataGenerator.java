package tools;

import static java.lang.String.format;

public class MonthsDataGenerator {

	private static final int START_YEAR = 2018;
	private static final int FINISH_YEAR = 2028;
	private static final int NUMBER_OF_MONTHS = 12;
	private final static String BASE_QUERY = "INSERT INTO `months_per_year` (date) VALUES (STR_TO_DATE('%s', '%%m/%%Y'));";

	public static void main(String[] args) {
		for (int year = START_YEAR; year <= FINISH_YEAR; year++) {
			for (int month = 1; month <= NUMBER_OF_MONTHS; month++) {
				System.out.println(format(BASE_QUERY, month + "/" + year));
			}

		}

	}

}
