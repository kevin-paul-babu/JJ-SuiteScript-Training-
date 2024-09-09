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
        const beforeLoad = (context) => {
            try{
                if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT){
                    log.debug("code started");
                    let cussearch = search.create({
                    type: search.Type.CUSTOMER,
                    columns: ['entityid','datecreated','firstname','internalid'],
                    title: "Shortname Customers Search OTP-7436",
                    id: 'customsearch_jj_ue_shortname_otp7436',
                    isPublic: false
                    });
                    
                    
                    let cusrun = cussearch.run().getRange({
                        start: 0,
                        end: 5
                    });
                    cusrun.forEach(function(result) 
                    {   let cus = {
                        customerId : result.getValue({name:'internalid'}),
                        dateCreated : result.getValue({name: 'datecreated'}),
                        firstName : result.getText({name:'firstname'}),
                        customerName : result.getValue({name:'entityid'})
                    }
                        let cust = cus.customerName;
                        let cusid = cus.customerId;
                        log.debug("id",cusid);
                         let datec = cus.dateCreated
                        log.debug("name",cust);
                        let monthCreated = ('0' + (new Date(datec).getMonth() + 1)).slice(-2);
                        log.debug("month",monthCreated);
                        // Create the short name
                        let sname = cust.substring(0, 2);
                        let shortName = sname + ': ' + monthCreated;
                        log.debug("sname",shortName);
                        log.debug("cusid",cusid);
                         
                        // Load the customer record and update the short name field
                        let customerRecord = record.load({
                            type: record.Type.CUSTOMER,
                            id: cusid,
                            isDynamic: false
                        });
            
                        customerRecord.setValue({
                            fieldId: 'custentity_jj_shortname_otp7436',
                            value: shortName
                        });
            
                        customerRecord.save({
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        });
            
                        return true; // Continue to the next result
                    });
                    
                }
            }catch(e){
                log.error("Error details",e.message)
            }
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
          
        }
       
           return {
            beforeLoad:beforeLoad
           };
       });
       



        