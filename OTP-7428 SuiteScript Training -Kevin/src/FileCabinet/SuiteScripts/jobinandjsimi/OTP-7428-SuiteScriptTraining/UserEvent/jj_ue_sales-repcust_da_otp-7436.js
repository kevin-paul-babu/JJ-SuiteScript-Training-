/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record','N/search'],
    /**
 * @param{record} record
 */
    (record,search) => {
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
            var newRecord = context.newRecord;
            if (newRecord.type === record.Type.SALES_ORDER && context.type === context.UserEventType.CREATE) {
                let salesrep =
                { sales: newRecord.getText({ fieldId:'salesrep'}),
                  recordId :newRecord.getValue({fieldId: 'id'}),
                  cusid: newRecord.getValue({fieldId:'entity'})
                }
                let searchobj = search.lookupFields({
                    type: search.Type.CUSTOMER,
                    id: salesrep.cusid,
                    columns: ['salesrep']
                }); 
                let sales = searchobj.salesrep[0].text;

                record.submitFields({
                    type: record.Type.SALES_ORDER,
                    id: salesrep.recordId,
                    values: {
                       'custbody_jj_sp_txt_da_otp7436':sales
                    }
          
                });

              
                let sp = newRecord.getText({ fieldId: 'custbody_jj_sp_txt_da_otp7436' });
                log.debug("salesrep",sp);
                
            }
            
          
          

        }
        

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
