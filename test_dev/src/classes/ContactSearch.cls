public class ContactSearch {
    public static List<Contact> searchForContacts(String s1, String s2){
        return [select LastName,MailingPostalCode from Contact order by LastName,MailingPostalCode desc];
    }
}