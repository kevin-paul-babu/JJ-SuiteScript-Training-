/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/search'],
    /**
 * @param{search} search
 */
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
            let customerSearch = search.create({
                type: search.Type.CUSTOMER,
                filters: [
                    ['datecreated', 'within', 'lastmonth'],
                    'AND',
                    ['subsidiary', 'anyof',1],
                    'AND',
                    ['stage','anyof',"CUSTOMER"]
                ],
                columns: [
                    'entityid',          
                    
                    'subsidiary',      
                    'salesrep',          
                    'email',            
                    'datecreated'        
                ]
            });
    
            let results = customerSearch.run().getRange({
                start: 0,
                end: 1000
            });
    
            let customerDetails = [];
    
            results.forEach(function(result) {
                let customer = {
                    name: result.getValue({ name: 'entityid' }),
                    subsidiary: result.getText({ name: 'subsidiary' }),
                    salesRep: result.getText({ name: 'salesrep' }),
                    email: result.getValue({ name: 'email' }),
                    datecreated: result.getValue({ name: 'datecreated' })
                };
                log.debug("name",customer.name);
                log.debug("subsidiary",customer.subsidiary);
                log.debug("salesRep",customer.salesRep);
                log.debug("email",customer.email);
                log.debug(" datecreated",customer. datecreated);
                
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
