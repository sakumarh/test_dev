trigger AccountAddressTrigger on Account (before insert,before update){

  for(Account accObj: trigger.new){
      If(accObj.Match_Billing_Address__c == True ){
      accObj.ShippingCity  = accObj.BillingCity;
      accObj.ShippingCountry   = accObj.BillingCountry ;
      accObj.ShippingState   = accObj.BillingState ;
      accObj.ShippingStreet   = accObj.BillingStreet ;
      accObj.ShippingPostalCode  = accObj.BillingPostalCode;
      accObj.ShippingGeocodeAccuracy    = accObj.BillingGeocodeAccuracy;     
      accObj.ShippingLatitude    = accObj.BillingLatitude  ;
      accObj.ShippingLongitude   = accObj.BillingLongitude ;
      }
  }

}