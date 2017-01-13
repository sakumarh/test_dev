public class autoCompleteCon {

    public String listOfString { get; set; }
 
 public List<String> listOfStrings {get; set;}
 
   //Constructor
   public autoCompleteCon() {
      listOfStrings = new List<String>();
      for(Account a: [SELECT id, Name From Account LIMIT 10])
      listOfStrings.add(a.name);
      }
}