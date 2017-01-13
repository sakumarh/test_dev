public class DataController {
    public List<Account> accountList {get;set;}
    public void retrieveData() {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://ap1.salesforce.com/services/oauth2/token');
        req.setMethod('GET');
        req.setBody('grant_type=password&client_id=clientID&client_secret=secretkey&username=username&password=password');
        Http http = new Http();
        HTTPResponse res = http.send(req);
        String resBody = res.getBody();
        Map<String,Object> jsonMap = (Map<String,Object>)JSON.deserializeUntyped(resbody);
        system.debug('jsonMapjsonMap'+jsonMap );
        String accessToken ='';
        if(jsonMap != null && jsonMap.containsKey('access_token')) {
            accessToken = String.valueOf(jsonMap.get('access_token'));
            system.debug('accessTokenaccessToken'+accessToken);
        }
        System.debug('initial response to get token'+res.getBody());
        if(accessToken != null) {
            HttpRequest req1 = new HttpRequest();
            req1.setEndpoint('https://ap1.salesforce.com/services/apexrest/displayAccounts');
            req1.setMethod('GET');
            req1.setHeader('Authorization','OAuth '+accessToken);
            Http http1 = new Http();
            HTTPResponse res1 = http1.send(req1);
            String resBody1 = res1.getBody();
            accountList = (List<Account>) JSON.deserialize(resBody1, List<Account>.class);
            system.debug('accountListaccountList '+accountList );
        }
    }
}