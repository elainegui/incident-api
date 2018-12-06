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
		private String country;
		private String city;
		private String email;
		private String password;
		private String confirmPassword;
		
		public UserRegister() {
			super();
		}
		
		public UserRegister(int id, String firstName, String lastName, String country, String city, String email,
				String password, String confirmPassword) {
			super();
			this.id = id;
			this.firstName = firstName;
			this.lastName = lastName;
			this.country = country;
			this.city = city;
			this.email = email;
			this.password = password;
			this.confirmPassword = confirmPassword;
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
		public String getConfirmPassword() {
			return confirmPassword;
		}
		public void setConfirmPassword(String confirmPassword) {
			this.confirmPassword = confirmPassword;
		}
		
		

	}
