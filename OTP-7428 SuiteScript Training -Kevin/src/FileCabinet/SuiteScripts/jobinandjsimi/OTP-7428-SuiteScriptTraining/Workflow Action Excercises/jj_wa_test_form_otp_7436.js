/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/redirect'],
    /**
 * @param{record} record
 * @param{redirect} redirect
 */
    (record, redirect) => {
        /**
         * Defines the WorkflowAction script trigger point.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.workflowId - Internal ID of workflow which triggered this action
         * @param {string} scriptContext.type - Event type
         * @param {Form} scriptContext.form - Current form that the script uses to interact with the record
         * @since 2016.1
         */
        const onAction = (scriptContext) => {
        try{

            let currentRecord = scriptContext.newRecord;
           
            let title = currentRecord.getValue("title");
           
            let recordType = "customrecordjj_wa_test_form_otp7436";
            let objRecord = record.create({
                type: recordType,
                isDynamic: true
            });
           
            let name = objRecord.setValue({
                    fieldId: "custrecord_jj_wa_name_otp7436",
                    value: title
                });
            log.debug("name",name);
            let test = objRecord.setValue({
                    fieldId: "custrecord_jj_wa_test_otp7436",
                    value: "Test from Workflow"
                });
                log.debug("test",test);   
            let recordId = objRecord.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });
            log.debug("record Id",recordId);   
            return recordId;

        }catch(e){
            log.error("Error details",e.message)
        }
        }
        return {onAction};
    });
