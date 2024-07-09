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
        const afterSubmit = (context) => {
          try{
            var newRecord = context.newRecord;
            if (newRecord.type === record.Type.SALES_ORDER && context.type === context.UserEventType.CREATE) {
                let cus = updateCustomerCheckbox(newRecord.getValue({ fieldId: 'entity' }));
                return cus ;
            }
    
            if (newRecord.type === record.Type.PURCHASE_ORDER && context.type === context.UserEventType.CREATE) {
              let  ven =updateVendorCheckbox(newRecord.getValue({ fieldId: 'entity' }));
              return ven ;
            }
        }catch(e) {  
            log.error({
            title: 'Error in afterSubmit',
            details: e.toString()
        });}
        }
        function updateCustomerCheckbox(cus) {
            try{
            record.submitFields({
                type: record.Type.CUSTOMER,
                id: cus,
                values: {
                    'custentityjj_so_created_otp7436': true
                },
                ignoreFieldChange: true
            });
        }catch(e) {  
            log.error({
            title: 'Error in afterSubmit',
            details: e.toString()
        });}
        }

        function updateVendorCheckbox(ven) {
           try{
            record.submitFields({
                type: record.Type.VENDOR,
                id: ven,
                values: {
                    'custentityjj_po_created_otp7436': true
                },
                ignoreFieldChange: true
            });

        }catch(e) {  
            log.error({
            title: 'Error in afterSubmit',
            details: e.toString()
        });}
        }
    
        return {beforeLoad, beforeSubmit, afterSubmit}

    });
