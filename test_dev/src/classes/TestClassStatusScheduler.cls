/**********************************
Class Name: TestClassStatusScheduler
Author : Satish Kumar
Description: Scheduler class which checks the status of enqueued job that was created for execution of test classes
**********************************/
public class TestClassStatusScheduler implements System.Schedulable {
    
    public Id jobId {get;set;}
    
    /**********************************
    Method: TestClassStatusScheduler
    IN Params: Id inJobId - Id of the job whose status needs to be checked
    OUT Param: NA
    Description: Argumented constructor
    **********************************/ 
    public TestClassStatusScheduler(Id inJobId){
        this.jobId = inJobId;
    }
    
    /**********************************
    Method: execute
    IN Params: SchedulableContext sc - contains status of the scheduled job
    OUT Param: Set<Id>
    Description: Checks the status of enqueued job and then aborts itself
    **********************************/ 
    public void execute(SchedulableContext sc){
        TestClassUtils.checkTestExecutionResult(jobId);
        System.abortJob(sc.getTriggerId());
    }
    
}