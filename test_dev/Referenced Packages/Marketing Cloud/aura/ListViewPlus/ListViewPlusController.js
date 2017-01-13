({
    doInit : function(component, event, helper) {
		var tableHeaderLabels = component.get("v.tableHeaderLabels");      
		var tableHeaders = tableHeaderLabels.split(",");
 		component.set("v.tableHeaders", tableHeaders);   
        var updateButtonLabel = component.get("v.updateButtonLabel");
        var updateButton = component.find("updateButton");
        updateButton.set("v.label", updateButtonLabel);
        var cancelButtonLabel = component.get("v.cancelButtonLabel");
        var cancelButton = component.find("cancelButton");
        cancelButton.set("v.label", cancelButtonLabel);
 	},
	
    afterScriptsLoaded : function (component, event, helper) {
        $('#tableDiv').hide();
    },
    
    doneRendering: function(component, event, helper) {
        var tableBuilt = component.get("v.tableBuilt");
        if(!tableBuilt){ 
            var infoLabel = component.get("v.infoLabel");
            var entriesPerPageLabel = component.get("v.entriesPerPageLabelPrefix") + " _MENU_ " + component.get("v.entriesPerPageLabelSuffix");
            var filteredLabel = component.get("v.filteredLabelPrefix") + " _MAX_ " + component.get("v.filteredLabelSuffix");
            var paginatePreviousLabel = component.get("v.paginatePreviousLabel");
            var paginateNextLabel = component.get("v.paginateNextLabel");
            var noDataLabel = component.get("v.noDataLabel");
            var noDataMessage = component.get("v.noDataMessage");
            var noDataFilterMessage = component.get("v.noDataFilterMessage");   
            if($("#mainTable").length){
                var table = $("#mainTable").DataTable({
                    "bSort": false,  
                    "bProcessing": true,
                    "oLanguage": {
                        "sInfo": infoLabel,
                        "sInfoEmpty": noDataLabel,
                        "sZeroRecords": noDataFilterMessage,
                        "sEmptyTable": noDataMessage,
                        "sLengthMenu": entriesPerPageLabel,
                        "sInfoFiltered": filteredLabel,
                        "oPaginate": {
                            "sPrevious": paginatePreviousLabel,
                            "sNext": paginateNextLabel
                        }
                    }
                });
                $('#selectAllCheckbox').click(function(e){
                    var rows = table.rows({ 'search': 'applied' }).nodes();
                    $('input[type="checkbox"]', rows).prop('checked', this.checked).change();
                });        
                $('#searchText').keyup(function(){
                    table.search($(this).val()).draw();
                });
                component.set("v.tableBuilt", true);
                $('#buildTableDiv').hide();
                $('#tableDiv').show();
            }
        }        
    },

    updateEvent : function(component, event, helper) {
        var updatedRecord = event.getParam("record");
        var updatedRecords = component.get("v.updatedRecords");
        var updatedRecordId = updatedRecord.Id;
        var foundRecords = $.grep(updatedRecords, function(e){ 
            return e.Id === updatedRecordId; 
        });
        if(foundRecords.length == 0) { 
            updatedRecords.push(updatedRecord);
		}else{
            var removedUpdatedRecordList = updatedRecords.filter(function (e) {
				return e.Id !== updatedRecordId;
			});
  			component.set("v.updatedRecords", removedUpdatedRecordList);
        }
        event.stopPropagation();  
    },
    
    cancel : function(component, event, helper) {
		top.window.location.href = "/apex/MarketingCloudSettings";        
    },
    
    update : function(component, event, helper) {
        var table = $('#mainTable').dataTable();
        var rows = table.fnGetNodes();
        var checked = false;
   		for(var i = 0; i < rows.length; i++){
            if($(rows[i]).find('input[type="checkbox"]:checked').length > 0){
       			checked = true; 	
                i = rows.length;
            } 
        }
        if(checked){
			helper.lvp_updateRecords(component);            
        }else{
            var saveErrorTitleLabel = component.get("v.saveErrorTitleLabel");
            var saveErrorLabel = component.get("v.saveErrorLabel");
			var cmpMessageEvent = component.getEvent("BCMessage");
            cmpMessageEvent.setParams({
                "messageTitle" : saveErrorTitleLabel,
                "errorMessage" : saveErrorLabel
            });
            cmpMessageEvent.fire();
        }
    }
})