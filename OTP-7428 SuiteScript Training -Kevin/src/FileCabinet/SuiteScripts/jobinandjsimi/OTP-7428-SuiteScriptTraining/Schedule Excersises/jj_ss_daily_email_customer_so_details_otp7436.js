/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/render', 'N/search'],
    /**
 * @param{email} email
 * @param{log} log
 * @param{record} record
 * @param{render} render
 * @param{search} search
 */
    (email, record, render, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
          try{
            let objSearch = search.create(
                {
                    type: search.Type.SALES_ORDER,
                    filters: [['trandate', 'on', 'today'],'AND',['mainline','is','T'] ],
                    columns: ['internalid','entity','tranid']
                });
                let customer;
                let interid;
                let recobj;
                let recPdf;
             
        objSearch.run().each(function(result){
                  customer = result.getValue({name:'entity'});
               log.debug("customer",customer);
               interid  = result.getValue({name:'internalid'});
               log.debug("so intenral id", interid);

                //    recobj = record.load({
                //     type: record.Type.SALES_ORDER,
                //     id: interid
                //   });
              
                    let soID = parseInt(interid);
                
                    recPdf = render.transaction({
                        entityId: soID,
                        printMode: render.PrintMode.PDF
                    });
                               //     recPdf = render.transaction({
                //         entityId:interid,
                //         printMode: render.PrintMode.PDF,
                //         inCustLocale: false
                //    });
           
            });
             
           email.send({
                author: -5,
                body: "Sales Order PDF is available!",
                recipients:customer,
                subject: "Sales Order PDF",
                attachments: [recPdf]
            }); 
       

          }catch(e){
            log.debug("error",e.message);

          }
        
        }

        return {execute}

    });
