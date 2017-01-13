@RestResource(urlMapping='/displayAccounts/*')
global class AccountRESTController {
	// Adding some comment to test Github push
    @HttpGet
    global static LIST<Account> getAccounts() {
        List <Account> accountList;
        try {
            accountList = [select id,name from Account limit 5];
            return accountList;
        }
        catch(Exception e) {
           system.debug('errror'+e.getMessage());
        }
        return accountList;
    } 
}