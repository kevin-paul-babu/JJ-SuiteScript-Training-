/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/search'],
    
    (search) => {
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
          let invobj = search.create({
            type: search.Type.INVOICE,
                filters: [
                    ['status', 'anyof', 'CustInvc:A'],
                    'AND',
                    ['mainline','is',"T"]
                ],
                columns: [
                    'tranid',          
                    'trandate',      
                    'entity',          
                    'email',            
                    'amount'        
                ]
          });
          let results = invobj.run().getRange({
            start: 0,
            end: 5
        });

        let invoiceDetails = [];
    
        results.forEach(function(result) {
            let invoices = {
                docno: result.getValue({ name: 'tranid' }),
                trandate: result.getValue({ name: 'trandate' }),
                entity: result.getText({ name: 'entity' }),
                email: result.getValue({ name: 'email' }),
                amount: result.getValue({ name: 'amount' })
            };
            log.debug("document no " + invoices.docno + ", trandate " + invoices.date + ", entity " + invoices.entity + ", email " + invoices.email + ", amount " + invoices.amount);

        });

        return {
            beforeLoad: beforeLoad
        };

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
