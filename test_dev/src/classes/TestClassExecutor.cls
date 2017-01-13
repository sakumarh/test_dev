/**********************************
Class Name: TestClassExecutor
Author : Satish Kumar
Description: Contains logic to execute test classes. This class will be used by scheduler class - TestClassScheduler
**********************************/
public class TestClassExecutor {
    
    /**********************************
    Method: getTestClasses
    IN Params: Set<Id> testClassIdSet - record id of all the test classes
    OUT Param: NA
    Description: Inserts a record of ApexTestQueueItem through which the test classes are scheduled to run
    **********************************/ 
    public static void enqueTestClassesExecution(Set<Id> testClassIdSet){
        if (testClassIdSet.size() > 0) {
            ApexTestQueueItem[] queueItems = new List<ApexTestQueueItem>();
            for (Id tstClsId : testClassIdSet) {
                queueItems.add(new ApexTestQueueItem(ApexClassId=tstClsId));
            }
            insert queueItems;
            
            // Get the job ID of the first queue item returned.
            ApexTestQueueItem item = 
                [SELECT ParentJobId FROM ApexTestQueueItem 
                 WHERE Id=:queueItems[0].Id LIMIT 1];
            TestClassUtils.checkTestExecutionResult(item.parentjobid);
        }
    }
    
}