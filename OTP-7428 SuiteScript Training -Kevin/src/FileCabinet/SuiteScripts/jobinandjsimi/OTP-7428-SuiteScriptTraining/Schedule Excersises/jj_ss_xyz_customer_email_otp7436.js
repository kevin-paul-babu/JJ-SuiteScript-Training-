/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/search'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{search} search
 */
    (email, record, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
        try{  let objSearch = search.create(
            {
                type: search.Type.CUSTOMER,
                filters: [['entityid', 'startswith', 'ABC'],'AND',['subsidiary','is',1] ],
                columns: ['internalid','companyname']
            });
            let entity;
            let name;
            let id;
            objSearch.run().each(function(result){
                entity = result.getValue({name: 'companyname'});
                //name   = result.getText({name: 'entityid'});
                id     = result.getValue({name: 'internalid'});
                
                log.debug("Customer is",entity);
                // log.debug("Customer is",name);
          });
              


               //let coID = parseInt(entity);

                email.send({
                    author: -5,
                    body: "This is a Daily Reminder for"+entity+"for all sales orders",
                    recipients:id,
                    subject: "Daily Reminder for"+entity 
                });

        }catch(e){
            log.debug("error",e.message)
        }
        }

        return {execute}

    });
