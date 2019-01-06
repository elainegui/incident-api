package ie.incidentapi.users;


	import javax.persistence.Entity;
	import javax.persistence.GeneratedValue;
	import javax.persistence.GenerationType;
	import javax.persistence.Id;

	@Entity
	public class UserRegister {

		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
		private int id;
		private String firstName;
		private String lastName;
		//added
		private int number;
		private String street;
		private String county;
		private String zipCode;
		
		private String country;
		private String city;
		private String email;
		private String password;
		//private String confirmPassword;
		private float userLatitude;
		private float userLongitude;
		
		public UserRegister() {
			super();
		}
		
		public UserRegister(int id, String firstName, String lastName, int number, String street, String county,
				String zipCode, String country, String city, String email, String password, float userLatitude,
				float userLongitude) {
			super();
			this.id = id;
			this.firstName = firstName;
			this.lastName = lastName;
			this.number = number;
			this.street = street;
			this.county = county;
			this.zipCode = zipCode;
			this.country = country;
			this.city = city;
			this.email = email;
			this.password = password;
			this.userLatitude = userLatitude;
			this.userLongitude = userLongitude;
		}

		public int getId() {
			return id;
		}

		public void setId(int id) {
			this.id = id;
		}

		public String getFirstName() {
			return firstName;
		}

		public void setFirstName(String firstName) {
			this.firstName = firstName;
		}

		public String getLastName() {
			return lastName;
		}

		public void setLastName(String lastName) {
			this.lastName = lastName;
		}

		public int getNumber() {
			return number;
		}

		public void setNumber(int number) {
			this.number = number;
		}

		public String getStreet() {
			return street;
		}

		public void setStreet(String street) {
			this.street = street;
		}

		public String getCounty() {
			return county;
		}

		public void setCounty(String county) {
			this.county = county;
		}

		public String getZipCode() {
			return zipCode;
		}

		public void setZipCode(String zipCode) {
			this.zipCode = zipCode;
		}

		public String getCountry() {
			return country;
		}

		public void setCountry(String country) {
			this.country = country;
		}

		public String getCity() {
			return city;
		}

		public void setCity(String city) {
			this.city = city;
		}

		public String getEmail() {
			return email;
		}

		public void setEmail(String email) {
			this.email = email;
		}

		public String getPassword() {
			return password;
		}

		public void setPassword(String password) {
			this.password = password;
		}

		public float getUserLatitude() {
			return userLatitude;
		}

		public void setUserLatitude(float userLatitude) {
			this.userLatitude = userLatitude;
		}

		public float getUserLongitude() {
			return userLongitude;
		}

		public void setUserLongitude(float userLongitude) {
			this.userLongitude = userLongitude;
		}

	}
