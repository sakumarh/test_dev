trigger ClosedOpportunityTrigger on Opportunity (after insert,after update) {

  List<task> newtaskList = new List<task>();

   For(Opportunity oppObj: trigger.new){
       IF(oppObj.StageName == 'Closed Won' ){
          task tskObj = new task();
            tskObj.Subject = 'Follow Up Test Task';
            tskObj.whatid = oppObj.id;
            newtaskList.add(tskObj);         
       } 
   }
   if(!newtaskList.isEmpty())
   database.insert(newtaskList);

}