({
	MAX_FILE_SIZE: 4 500 0000, /* 6 000 000 * 3/4 to account for base64 */
    CHUNK_SIZE: 735 000, /* Use a multiple of 4 */
    
    isAuthorized: function(component, filePath) {     
        var action = component.get("c.checkAuthentication");
        action.setCallback(this, function(actionResult) {
            component.set("v.authorized", actionResult.getReturnValue());
    		var auth = component.get("v.authorized");
        	if(auth.isAuthorized)
    			this.getMetadata(component, filePath);
        });        
        $A.enqueueAction(action);
    },
        
    setRedirect : function(component, client_id, RedirectURI) {
        window.location.href = 'https://www.dropbox.com/1/oauth2/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + RedirectURI + '&state='+component.get("v.recordId");        
    },
    
    getMetadata: function(component, path) {     
        var action = component.get("c.getMetadata");
        action.setParams({            
            path: path           
        });
        action.setCallback(this, function(actionResult) {
            component.set("v.metadata", actionResult.getReturnValue());
            console.log(actionResult.getReturnValue());
        });        
        $A.enqueueAction(action);
    },
    
    getFileURL: function(component, path) {     
        var action = component.get("c.viewMedia");
        action.setParams({            
            path: path           
        });
        action.setCallback(this, function(actionResult) {                        
            console.log(actionResult.getReturnValue());
            window.open(actionResult.getReturnValue(),"_blank");
        });        
        $A.enqueueAction(action);
    },
    
    createFolderHelper : function(component, path){        
        var action = component.get("c.createNewFolder");
        action.setParams({            
            path: path          
        });
        action.setCallback(this, function(actionResult) {                        
            console.log(actionResult.getReturnValue());
            $A.util.removeClass(component.find("newFolderModal").getElement(), "slds-fade-in-open");
        });        
        $A.enqueueAction(action);
    },
    
    deleteFile : function(component, path){     
        var action = component.get("c.deleteMedia");
        action.setParams({            
            path: path          
        });
        action.setCallback(this, function(actionResult) {                        
            console.log(actionResult.getReturnValue());
            //$A.util.removeClass(component.find("newFolderModal").getElement(), "slds-fade-in-open");
        });        
        $A.enqueueAction(action);
    },
        
    save : function(component, file_path) {
        
        var totFiles = component.get("v.totalFiles");
        var fileInput = component.find("file").getElement();
        console.log(fileInput.files.length + "    " + totFiles);
        if(fileInput.files.length > totFiles){
            var file = fileInput.files[totFiles];
                
            var fr = new FileReader();
            var self = this;
            fr.onload = function() {
                var fileContents = fr.result;
                var base64Mark = 'base64,';
                var dataStart = fileContents.indexOf(base64Mark) + base64Mark.length;
    
                fileContents = fileContents.substring(dataStart);
           
                self.upload(component, file, fileContents, file_path);
            };
    
            fr.readAsDataURL(file);
        }else{
            var filePath = component.get("v.filePath");
            this.getMetadata(component, filePath);
            this.doneWaiting(component);
            $A.util.removeClass(component.find("uploadFileModal").getElement(), "slds-fade-in-open");
        }
    },
        
    upload: function(component, file, fileContents, file_path) {
        var fromPos = 0;
        var toPos = Math.min(fileContents.length, fromPos + this.CHUNK_SIZE);
		
       	// start with the initial chunk
        this.uploadChunk(component, file, fileContents, fromPos, toPos, '', 0, false, file_path);   
    },
     
    uploadChunk : function(component, file, fileContents, fromPos, toPos, uploadId, offset, commitFlag, file_path) {
        var action = component.get("c.uploadChunk"); 
        var chunk = fileContents.substring(fromPos, toPos);
		var path = file_path + file.name;
        
        action.setParams({            
            fileName: path,
            base64Data: encodeURIComponent(chunk), 
            uploadId: uploadId,
            offset: offset,
            commitFlag: commitFlag
        });
       
        var self = this;
        action.setCallback(this, function(a) {
            console.log(a.getReturnValue());
            console.log(a.getReturnValue());
            if(a.getReturnValue() != ''){
                var json = a.getReturnValue();
                
                obj = JSON.parse(json);
                uploadId = obj.upload_id;
                offset = obj.offset;
                fromPos = toPos;
                toPos = Math.min(fileContents.length, fromPos + self.CHUNK_SIZE);
                
                if (fromPos < toPos) {
                    console.log("upload");
                    self.uploadChunk(component, file, fileContents, fromPos, toPos, uploadId, offset, false, file_path);  
                }else{            
                    console.log("commit");
                    self.uploadChunk(component, file, fileContents, fromPos, toPos, uploadId, offset, true, file_path);
                    var tf = component.get("v.totalFiles");
                    component.set("v.totalFiles", tf + 1);
                    var filePath = component.get("v.filePath");
            		this.getMetadata(component, filePath);
                    self.save(component, file_path);
                }   
            }
        });
            
        $A.run(function() {
            $A.enqueueAction(action); 
        });
    },
        
    waiting: function(component) {
    	$A.util.addClass(component.find("uploading").getElement(), "uploading");
    	$A.util.removeClass(component.find("uploading").getElement(), "notUploading");
    },
    
    doneWaiting: function(component) {
    	$A.util.removeClass(component.find("uploading").getElement(), "uploading");
    	$A.util.addClass(component.find("uploading").getElement(), "notUploading");
    },
})