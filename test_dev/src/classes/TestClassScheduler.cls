/**********************************
Class Name: TestClassScheduler
Author : Ravi Dutt Sharma
Description: Schedule this class to run as per the required frequency. You can schedule it to run daily once at a particular time.
**********************************/
public class TestClassScheduler implements System.Schedulable {
    
    public void execute(SchedulableContext sc){
        TestClassExecutor.enqueTestClassesExecution(TestClassUtils.getTestClasses());
    }
    
}