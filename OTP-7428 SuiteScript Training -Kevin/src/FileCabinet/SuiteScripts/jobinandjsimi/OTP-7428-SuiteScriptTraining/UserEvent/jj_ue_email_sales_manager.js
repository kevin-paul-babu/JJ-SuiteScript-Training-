/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/email', 'N/log', 'N/record', 'N/runtime', 'N/search'],
    /**
 * @param{email} email
 * @param{log} log
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (email, log, record, runtime, search) => {
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
        const afterSubmit = (scriptContext) => {

            try{
               
                    let so = scriptContext.newRecord;
                    let cusid = so.getValue({fieldId:'entity'});
                    log.debug("cusid",cusid);

                    let cus = search.lookupFields({
                        type: search.Type.CUSTOMER,
                        id: cusid,
                        columns: ['overduebalance']
                       });
                  
                    let overdue = cus.overduebalance;
                    log.debug("overdue",overdue);
                    if(overdue > 0)
                    {
                        let salesrep =  so.getValue({fieldId:'salesrep'});
                        log.debug("salesrep",salesrep);
                        let emp = search.lookupFields({
                            type: search.Type.EMPLOYEE,
                            id: salesrep,
                            columns: ['supervisor']
                           });
                    
                    let salesManagerId = emp.supervisor[0].value ;
                    log.debug("supervisor",salesManagerId);
                    if (salesManagerId) 
                        {
                           let salesManagerEmail = search.lookupFields({
                            type: search.Type.EMPLOYEE,
                            id: salesManagerId,
                            columns: ['email']
                           });

                           let salesemail = salesManagerEmail.email;
                           log.debug("salesemail",salesemail);

                        let sender  = runtime.getCurrentUser().id;
                        //let sender =  author123;
                        log.debug("author",author123);
                        log.debug("authoremail",author123.email);
                        log.debug("authorid",author123.id)
                        if (scriptContext.type === scriptContext.UserEventType.CREATE) {
                            sendEmail(sender,salesemail);
                           }
                        
                        }
                    }
                
            }catch(e){
                log.error("error",e.message);
            }
            

        }
        function sendEmail(sender,salesemail) {
           try{
            email.send({
                author: sender,
                recipients: salesemail,
                subject: 'Overdue Balance Alert for Sales Order',
                body: 'A sales order has been created for a customer with an overdue balance. Please review the details and take necessary actions.'
            });
           }catch(e){
            log.error("error",e.message);
        }
    
           

            //log.debug("user:",recipient);
        }


        return { afterSubmit:afterSubmit}

    });
