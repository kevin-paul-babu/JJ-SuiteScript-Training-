/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            let objRecord = record.create({
                type: record.Type.VENDOR,
                isDynamic: true,
              });
    
              objRecord.setValue({
                        fieldId: 'companyname',
                        value: " KD & Co ",
                        ignoreFieldChange: true
                    });
                    objRecord.setValue('subsidiary',11);
                    objRecord.setValue('email',"kd@info.com");
                    objRecord.setValue('phone',7548568400);
            let recordId = objRecord.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });
             log.debug("recordID", recordId);



             let VSearch = search.create({
                type: search.Type.VENDOR,
                columns: [
                    'entityid',        
                    'subsidiary',           
                ]
            });
    
            let results = VSearch.run().getRange({
                start: 0,
                end: 1000
            });
    
            let vendorDetails = [];
    
            results.forEach(function(result) {
                let vendor = {
                    name: result.getValue({ name: 'entityid' }),
                    subsidiary: result.getText({ name: 'subsidiary' }),
                };
                log.debug("name " + vendor.name +"|" + "subsidiary " + vendor.subsidiary);
            });

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
