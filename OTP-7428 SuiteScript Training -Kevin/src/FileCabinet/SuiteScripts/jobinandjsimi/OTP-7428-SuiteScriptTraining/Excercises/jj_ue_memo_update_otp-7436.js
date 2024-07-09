/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the scriptContext.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the scriptContext.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the scriptContext.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
            try{
            var newRecord = scriptContext.newRecord;
            if (newRecord.type === record.Type.SALES_ORDER && 
                (scriptContext.type === scriptContext.UserEventType.CREATE || scriptContext.type === scriptContext.UserEventType.EDIT)){
                var memoUpdated = newRecord.getValue('custbodyjj_ue_memo_update_otp7438');
                var recordId = newRecord.id;
    
                if (memoUpdated) {
                    record.submitFields({
                        type: record.Type.SALES_ORDER,
                        id: recordId,
                        values: {
                            memo: 'memo updated'
                        }
                    });
                }
            }
        }catch(e) {  
            log.error({
            title: 'Error in afterSubmit',
            details: e.toString()
        });}
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
