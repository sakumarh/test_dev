({    
    lvp_getRecords : function(component) {
        var action = component.get("c.getRecords");
        var sObjectAPIName = component.get("v.sObjectAPIName");
        var sObjectFields = component.get("v.sObjectFields");
        action.setParams({
            sObjectFields : sObjectFields,
	        sObjectAPIName : sObjectAPIName
		});
        action.setCallback(this, function(response){
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var records = response.getReturnValue();
                component.set("v.records", records);
                if(records.length >= 4000){
                    var recordLimitLoadTitleLabel = component.get("v.recordLimitLoadTitleLabel");
            		var recordLimitLoadLabel = component.get("v.recordLimitLoadLabel");
                    var cmpMessageEvent = component.getEvent("BCMessage");
                    cmpMessageEvent.setParams({
                        "messageTitle" : recordLimitLoadTitleLabel,
                        "toastMessage" : recordLimitLoadLabel
                    });
                    cmpMessageEvent.fire();
                }
            }
            if (component.isValid() && state === "ERROR") {
				component.set("v.records", []);
                var recordLoadErrorTitleLabel = component.get("v.recordLoadErrorTitleLabel");
          		var recordLoadErrorLabel = component.get("v.recordLoadErrorLabel");
                var cmpMessageEvent = component.getEvent("BCMessage");
                cmpMessageEvent.setParams({
                    "messageTitle" : recordLoadErrorTitleLabel,
                    "errorMessage" : recordLoadErrorLabel
                });
                cmpMessageEvent.fire();
            }
        });
	 	$A.enqueueAction(action);
    },
    
    lvp_updateRecords : function(component) {
		var updatedRecords = component.get("v.updatedRecords");
        if(updatedRecords.length > 0){
            var action = component.get("c.updateRecords");
            action.setParams({
                sObjects : updatedRecords
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                var cmpMessageEvent = component.getEvent("BCMessage");
                if (component.isValid() && state === "SUCCESS") {
                    var result = JSON.parse(response.getReturnValue());
                    if(!result.hasErrors) {
                        component.set("v.updatedRecords", []);
                        top.window.location.href = "/apex/MarketingCloudSettings";
                    }else{
                        var saveServerErrorTitleLabel = component.get("v.saveServerErrorTitleLabel");
          				var saveServerErrorLabel = component.get("v.saveServerErrorLabel");
                        cmpMessageEvent.setParams({
                            "messageTitle" : saveServerErrorTitleLabel,
                            "errorMessage" : saveServerErrorLabel
                        });
                        cmpMessageEvent.fire();
                    }
                }
                if (component.isValid() && state === "ERROR") {
                    var saveServerErrorTitleLabel = component.get("v.saveServerErrorTitleLabel");
          			var saveServerErrorLabel = component.get("v.saveServerErrorLabel");
                    cmpMessageEvent.setParams({
                        "messageTitle" : saveServerErrorTitleLabel,
                        "errorMessage" : saveServerErrorLabel
                    });
                    cmpMessageEvent.fire();
                }
            });
            $A.enqueueAction(action);
        }else{
            var saveNoChangeTitleLabel = component.get("v.saveNoChangeTitleLabel");
 			var saveNoChangeLabel = component.get("v.saveNoChangeLabel");
            var cmpMessageEvent = component.getEvent("BCMessage");
            cmpMessageEvent.setParams({
                "messageTitle" : saveNoChangeTitleLabel,
                "errorMessage" : saveNoChangeLabel
            });
            cmpMessageEvent.fire();
        }
    }
})