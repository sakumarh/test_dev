({  
    doInit : function (component, event, helper) {
        var json = component.get("v.json");
        
        if(json  === null || json === "undefined") {
            component.set("v.json",helper.setJSON());
        }
	},
    showText : function(component, event) {
        var urllink = component.find("urllink");
		var element = urllink.getElement();
        element.setAttribute('disabled', 'disabled');
        var divAPIUrl = component.find("divAPIUrl");
        $A.util.removeClass(divAPIUrl.getElement(), 'hide');
   		var divAdvancedlink = component.find("divAdvancedlink");
        $A.util.addClass(divAdvancedlink.getElement(), 'hide');
		var divURLlink = component.find("divURLlink");
        $A.util.removeClass(divURLlink.getElement(), 'hide');
    },
	enableText : function(component, event) {
		var urllink = component.find("urllink");
		var element = urllink.getElement();
		element.removeAttribute('disabled');
        var divURLlink = component.find("divURLlink");
        $A.util.addClass(divURLlink.getElement(), 'hide');
    },
    loginAttempt : function (component, event, helper) {
        var uname = component.find("uname");
        var json = component.get("v.json");
        var unameval = uname.get("v.value");
        if(typeof unameval === "undefined" || unameval.length === 0){
            uname.set("v.errors",[{message:"Please enter a " + json.first_label}]);
        }else{
            uname.set("v.errors", null);           
        }
       
        var passw = component.find("passw");
        var passwval = passw.get("v.value");
        if(typeof passwval === "undefined" || passwval.length === 0){
            passw.set("v.errors", [{message:"Please enter a " + json.second_label}]);
        }else{
            passw.set("v.errors", null); 
        }
        
        if(json.advanced_settings_flag) {
            var url_link = component.find("urllink");
            var url_linkval = url_link.get("v.value");
            if(typeof url_linkval === "undefined" || url_linkval.length === 0){
                url_link.set("v.errors", [{message:"Please enter a " + json.third_label}]);
            }else{
                url_link.set("v.errors", null); 
            }
        }
        
        //Excecute callout if possible
        if(passw.get("v.errors") == null && uname.get("v.errors") == null && url_link.get("v.errors") == null)
        {
            var element = component.find("connect_button").getElement();
            element.setAttribute('disabled', 'disabled');
            var action = component.get(json.authenticate);
            var strFirst = "" + json.firstParamName;
            var strSec = "" + json.secParamName;
            var strTh = "" + json.thirdParamName;
            action.setParams({"username" : unameval, "password" : passwval, "authAPIUrl": url_linkval});
            
            action.setCallback(this, function(response) {
                var state = response.getState();
                var data = JSON.parse(response.getReturnValue());
                if(component.isValid() && state === "SUCCESS" && !data.hasErrors) {
                    top.window.location.href = json.top + "";
                }
                else {
                    var errorEvent = $A.get(json.error);
                    var message;
                    if(data != null) {
                        if (data.message) {
                            message = data.message;
                        }
                        else {
                            message = $A.get("$Label.et4ae5.unkError");
                        }
                    }
                    else {
                        message = $A.get("$Label.et4ae5.msg0211");
                    }
                    errorEvent.setParams({"title" : $A.get("$Label.et4ae5.usrCredErr"), "message" : message});
                    errorEvent.fire();
                }
				element.removeAttribute('disabled');
            });
                $A.enqueueAction(action);
        }
    }
})