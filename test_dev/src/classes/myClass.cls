global class myClass {
	webService static Id makeContact (String lastName, Account a) {
		Contact c = new Contact(LastName = lastName, AccountId = a.Id);
		return c.id;
	}
}