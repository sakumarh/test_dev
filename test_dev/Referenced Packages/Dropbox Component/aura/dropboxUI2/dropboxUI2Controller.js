({
    doInit : function(component, event, helper) {
        var recordId = component.get("v.recordId");
        var sObjectName = component.get("v.sObjectName");
        var filePath = '';        
        if(sObjectName != '' && recordId != ''){
            filePath = '/' + sObjectName + '/' + recordId;
            component.set("v.filePath",sObjectName + '/' + recordId);
        }
        helper.isAuthorized(component , filePath);
        var auth = component.get("v.authorized");
        
    },   
    
    redirectPage : function(component, event, helper) {
        var auth = component.get("v.authorized");
        if(auth == null){
            component.set("v.isErr", true);
            
        }else{
            component.set("v.isErr", false);
            var client_id = auth.appKey;
            var RedirectURI = auth.redirectURI;
            helper.setRedirect(component, client_id, RedirectURI);            
        }
    },
    
    uploadFiles : function(component, event, helper) {
        component.set("v.totalFiles", 0);
        helper.waiting(component);       
        var filePath = component.get("v.filePath");
        helper.save(component, filePath + "/");
        
    },
    
    setNavigationEvent : function(component, event, helper){
        var recordId = component.get("v.recordId");
        var sObjectName = component.get("v.sObjectName");
        var filePath = '';        
        if(sObjectName != '' && recordId != '')
            filePath = '/' + sObjectName + '/' + recordId;           
        
        var index = event.getParam("navBarEvent"); 
        var navbNew = [];
        navbNew.push("Home");
        var navb = component.get("v.Nav");
        for(i=1; i<=index; i++){
            filePath += '/' + navb[i];
            navbNew.push(navb[i]);
        }
        
        helper.getMetadata(component, filePath);
        console.log(navbNew);
        component.set("v.Nav", navbNew);
        component.set("v.filePath",filePath);
    },
    
    setMetadataUsingEvent : function(component, event, helper){        
        var filePath = component.get("v.filePath");
        var fileName = event.getParam("fileNameEvent");
        var fileType = event.getParam("fileTypeEvent");
        
        filePath = filePath == '' ? fileName : filePath + '/' + fileName;
        if(fileType == 'file'){
            helper.getFileURL(component, filePath);
        }else if(fileType == 'folder'){  
            /*--------------*/
            var navb = component.get("v.Nav");
            console.log(navb);
            navb.push(fileName);
            component.set("v.Nav",navb);
            /*------------------------*/
            component.set("v.filePath",filePath);
            helper.getMetadata(component, filePath);
        }else if(fileType == 'delete'){
            var r = confirm("Are you sure you want to delete "+ fileName +" from your Dropbox?");
            if (r == true) {
                helper.deleteFile(component, filePath);
                filePath = component.get("v.filePath");
                helper.getMetadata(component, filePath);
            } 
            
        }
    },
    
    createFolder : function(component, event, helper){
        var foldername = component.find("foldername").get("v.value");
        var filePath = component.get("v.filePath");
        helper.createFolderHelper(component, filePath + '/' + foldername);
        helper.getMetadata(component, filePath);
    },
    
    showUploadModal : function(component, event, helper){
        $A.util.addClass(component.find("uploadFileModal").getElement(), "slds-fade-in-open");    	
    },
    
    hideUploadModal : function(component, event, helper){
        $A.util.removeClass(component.find("uploadFileModal").getElement(), "slds-fade-in-open");
    },
    
    showFolderModal : function(component, event, helper){
        $A.util.addClass(component.find("newFolderModal").getElement(), "slds-fade-in-open");
    },
    
    hideFolderModal : function(component, event, helper){
        $A.util.removeClass(component.find("newFolderModal").getElement(), "slds-fade-in-open");
    },
})