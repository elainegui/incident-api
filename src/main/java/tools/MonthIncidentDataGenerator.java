package tools;

import ch.qos.logback.core.net.SyslogOutputStream;

import java.util.Arrays;
import java.util.concurrent.ThreadLocalRandom;

import static java.lang.String.format;

public class MonthIncidentDataGenerator {

    private static final float COORDINATES_MINIMUM_DELTA = -3000;
    private static final float COORDINATES_MAXIMUM_DELTA = 3000;
    private static final int NUMBER_OF_TYPES = 6;
    private static final int NUMBER_OF_MONTHS = 12;
    private final static String BASE_QUERY = "INSERT INTO `incident` (date, image, latitude, longitude, message, user_id, verified, type_id, country, state, city) VALUES ('%s', '%s', %f, %f, '%s', 0 , '\\0' , %d, '%s', '%s', '%s');";
    private final static String BASE_MESSAGE = "auto-generated incident %d";
    private final static String BASE_DATE = "2018-%s-01 00:00:00";
    private final static double BASE_LONGITUDE = -7.903531;
    private final static double BASE_LATITUDE = 53.418200;
    private static final int NUMBER_OF_COUNTRIES = 2;
    private static final int NUMBER_OF_STATES = 3;
    private static final int NUMBER_OF_CITIES = 3;

    public static void main(String[] args) {
        GeoData[][][] geoDatas = createGeographicalData();

        int incidentCount = 1;
        for (int month = 1; month <= NUMBER_OF_MONTHS; month++) {
            int numberIterations = ThreadLocalRandom.current().nextInt(20, 40 + 1);
            String date = format(BASE_DATE, month);
            for (int iteration = 0; iteration < numberIterations; iteration++) {
                double latitude = BASE_LATITUDE + ThreadLocalRandom.current().nextDouble(COORDINATES_MINIMUM_DELTA,
                        COORDINATES_MAXIMUM_DELTA + 1) / 1_000_000;
                double longitude = BASE_LONGITUDE + ThreadLocalRandom.current().nextDouble(COORDINATES_MINIMUM_DELTA,
                        COORDINATES_MAXIMUM_DELTA + 1) / 1_000_000;
                String message = format(BASE_MESSAGE, incidentCount++);
                int typeId = ThreadLocalRandom.current().nextInt(0, NUMBER_OF_TYPES);
                GeoData geoData = randomizeGeoData(geoDatas);
                //String image = "|X|X|";
                String image = "";
                //data:image/png;base64,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
                System.out.println(format(BASE_QUERY, date, image, latitude, longitude, message, typeId, geoData.getCountry(), geoData.getState(), geoData.getCity()));
            }
        }
    }

    private static GeoData randomizeGeoData(GeoData[][][] geoDatas) {
        int countryCode = ThreadLocalRandom.current().nextInt(0, NUMBER_OF_COUNTRIES);
        int stateCode = ThreadLocalRandom.current().nextInt(0, NUMBER_OF_STATES);
        int cityCode = ThreadLocalRandom.current().nextInt(0, NUMBER_OF_CITIES);
        return geoDatas[countryCode][stateCode][cityCode];
    }

    private static GeoData[][][] createGeographicalData() {
        GeoData[][][] geoData = new GeoData[NUMBER_OF_COUNTRIES][NUMBER_OF_STATES][NUMBER_OF_CITIES];

        //Ireland, Westmeath
        geoData[0][0][0] = new GeoData("Ireland", "Westmeath", "Athlone");
        geoData[0][0][1] = new GeoData("Ireland", "Westmeath", "Mullingar");
        geoData[0][0][2] = new GeoData("Ireland", "Westmeath", "Kilbeggan");

        //Ireland, Sligo
        geoData[0][1][0] = new GeoData("Ireland", "Sligo", "Tubbercurry");
        geoData[0][1][1] = new GeoData("Ireland", "Sligo", "Enniscrone");
        geoData[0][1][2] = new GeoData("Ireland", "Sligo", "Collooney");

        //Ireland, Mayo
        geoData[0][2][0] = new GeoData("Ireland", "Mayo", "Castlebar");
        geoData[0][2][1] = new GeoData("Ireland", "Mayo", "Ballina");
        geoData[0][2][2] = new GeoData("Ireland", "Mayo", "Westport");

        //Brazil, Rio de Janeiro
        geoData[1][0][0] = new GeoData("Brazil", "Rio de Janeiro", "Cabo Frio");
        geoData[1][0][1] = new GeoData("Brazil", "Rio de Janeiro", "Petropolis");
        geoData[1][0][2] = new GeoData("Brazil", "Rio de Janeiro", "Rio Bonito");

        //Brazil, Sao Paulo
        geoData[1][1][0] = new GeoData("Brazil", "Sao Paulo", "Piracicaba");
        geoData[1][1][1] = new GeoData("Brazil", "Sao Paulo", "Ribeirao Preto");
        geoData[1][1][2] = new GeoData("Brazil", "Sao Paulo", "Campinas");

        //Brazil, Bahia
        geoData[1][2][0] = new GeoData("Brazil", "Bahia", "Salvador");
        geoData[1][2][1] = new GeoData("Brazil", "Bahia", "Porto Seguro");
        geoData[1][2][2] = new GeoData("Brazil", "Bahia", "Ilheus");



        return geoData;
    }

    static class GeoData {
        @Override
        public String toString() {
            return "GeoData{" +
                    "country='" + country + '\'' +
                    ", state='" + state + '\'' +
                    ", city='" + city + '\'' +
                    '}';
        }

        private String country;
        private String state;
        private String city;

        public GeoData(String country, String state, String city) {
            this.country = country;
            this.state = state;
            this.city = city;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }
    }

}
