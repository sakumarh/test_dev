({
	openFolder : function(component, event, helper) { 
        var cmpEvent = component.getEvent("cmpEvent");
        var fileName = component.get("v.fileName");
        cmpEvent.setParams({"fileNameEvent" : fileName, "fileTypeEvent" : "folder"});
        cmpEvent.fire();        
    },
    
    openFile : function(component, event, helper) {  
        var cmpEvent = component.getEvent("cmpEvent");
        var fileName = component.get("v.fileName");
        cmpEvent.setParams({"fileNameEvent" : fileName, "fileTypeEvent" : "file"});
        cmpEvent.fire();        
    },
    
    deleteFile : function(component, event, helper) {  
        var cmpEvent = component.getEvent("cmpEvent");
        var fileName = component.get("v.fileName");
        cmpEvent.setParams({"fileNameEvent" : fileName, "fileTypeEvent" : "delete"});
        cmpEvent.fire();        
    },
})