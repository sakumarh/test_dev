/**********************************
Class Name: TestClassUtils
Author : Satish Kumar
Description: Utility class that contains resuable methods.
**********************************/
public class TestClassUtils {
    
    /**********************************
    Method: getTestClasses
    IN Params: NA
    OUT Param: Set<Id>
    Description: Returns a set containing the id of all test classes
    **********************************/      
    public static Set<Id> getTestClasses(){
        Set<Id> testClassIdSet = new Set<Id>();
        ApexClass[] testClasses = 
            [SELECT Body FROM ApexClass 
             WHERE NamespacePrefix=''];
        for(ApexClass apexClass : testClasses){
            if(apexClass.Body.containsIgnoreCase('@isTest')){
                testClassIdSet.add(apexClass.Id);
            }            
        }
        return testClassIdSet;
    }
    
    /**********************************
    Method: sendEmail
    IN Params: String body - email body
    List<String> sendTo- list of email id's
    OUT Param: NA
    Description: Generic method to send email
    **********************************/     
    public static void sendEmail(String body,List<String> sendTo){
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(sendTo);
        mail.setSenderDisplayName('Salesforce Admin');
        mail.setSubject('Test Class Status');
        String mailBody = body; 
        mail.setHtmlBody(mailBody);
        mails.add(mail);
        Messaging.sendEmail(mails);
    }
    
    /**********************************
    Method: checkTestExecutionResult
    IN Params: NA
    OUT Param: NA
    Description: Checks whether the asyncjob has completed or not. On completion, it sends a status mail. If the job it not completed, it creates
    another scheduled job which will call the same method again after 300 secs.
    **********************************/  
    public static void checkTestExecutionResult(Id jobId){
        AsyncApexJob job = 
            [SELECT Status 
             FROM AsyncApexJob 
             WHERE Id=:jobId LIMIT 1];
        if(job.Status == 'Completed'){
            List<String> sendTo = new List<String>();
            sendTo.add('Satish.kumar.hale@accenture.com');
            TestClassUtils.sendEmail(TestClassUtils.createMailBody(TestClassUtils.checkMethodStatus(jobId)), sendTo);
        }else{
            Datetime sysTime = System.now().addSeconds(300);      
            String chronExpression = '' + sysTime.second() + ' ' + sysTime.minute() + ' ' + sysTime.hour() + ' ' + sysTime.day() + ' ' + sysTime.month() + ' ? ' + sysTime.year();
            System.schedule( 'TestClassStatusScheduler ' + sysTime, chronExpression, new TestClassStatusScheduler(jobId) );
        }
    }
    
    /**********************************
    Method: checkMethodStatus
    IN Params: ID jobId - Id of the enqued job
    OUT Param: ApexTestResult[] - Execution status of enqued job
    Description: If the job status is completed, this method will be called which will provide information of the status of each of the
    test method
    **********************************/ 
    public static ApexTestResult[] checkMethodStatus(ID jobId) {
        ApexTestResult[] results = 
            [SELECT Outcome, ApexClass.Name, MethodName, Message, StackTrace 
             FROM ApexTestResult 
             WHERE AsyncApexJobId=:jobId ORDER BY ApexClass.Name];
        return results;
    }
    
    /**********************************
    Method: createMailBody
    IN Params: ApexTestResult[] results - Execution status of enqued job
    OUT Param: String - Email body
    Description: Utility method to create email body
    **********************************/ 
    public static String createMailBody(ApexTestResult[] results){
        String mailBody = '<html><body>';
        mailBody = mailBody + '<b>Test Class Execution Status as of '+ System.now() + '</b><br/><br/>';
        mailBody = mailBody + '<table style="width:100%" border="1">';
        mailBody = mailBody + '<tr>'+
        '<td bgcolor="Blue"><b><font color="white">Status</font></b></td>'+
        '<td bgcolor="Blue"><b><font color="white">Method Name</font></b></td>'+
        '<td bgcolor="Blue"><b><font color="white">Class Name</font></b></td>'+
        '<td bgcolor="Blue"><b><font color="white">Message</font></b></td>'+
        '<td bgcolor="Blue"><b><font color="white">Stack Trace</font></b></td>'+
        '</tr>';
        for(ApexTestResult result : results){
            mailBody = mailBody + '<tr>';
            mailBody = mailBody + '<td>' +  result.Outcome + '</td>';
            mailBody = mailBody + '<td>' + result.MethodName + '</td>';
            mailBody = mailBody + '<td>' + result.ApexClass.Name + '</td>';
            if(!String.isBlank(result.Message)){
                mailBody = mailBody + '<td>' + result.Message + '</td>';
            }else{
                mailBody = mailBody + '<td>' + '</td>';
            }
            if(!String.isBlank(result.StackTrace)){
                mailBody = mailBody + '<td>' + result.StackTrace + '</td>';
            }else{
                mailBody = mailBody + '<td>' + '</td>';
            }
            mailBody = mailBody + '</tr>';
        }
        mailBody = mailBody + '</table>';
        mailBody = mailBody + '</body></html>';
        return mailBody;
    }
}