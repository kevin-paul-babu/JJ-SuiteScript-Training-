/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/currentRecord', 'N/log', 'N/record', 'N/search'],
    /**
 * @param{currentRecord} currentRecord
 * @param{log} log
 * @param{record} record
 * @param{search} search
 */
    (currentRecord, log, record, search) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        // const beforeLoad = (scriptContext) => {
         
        //  }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
         const beforeSubmit = (scriptContext) => {
            try
            {
               
                    let newrecordObj =  scriptContext.newRecord;
                    let oldrecordObj = scriptContext.oldRecord;
                //Displaying the intial value of address_changed checkbox
                    let address_changed = newrecordObj.getValue({
                        fieldId: 'custentity_jj_ue_address_change_otp7436'
                        });
                        log.debug(" old value",address_changed);
                //Retrieving the old record line count
                    let count1 = oldrecordObj.getLineCount({
                        sublistId: "addressbook"
                    });
                    log.debug("count",count1);
                     //Retrieving the new record line count
                    let count2 = newrecordObj.getLineCount({
                        sublistId: "addressbook"
                    });
                    log.debug("count",count2);
                     //Retrieving the old record address
                    let oldaddress;
                    for (i = 0;i<count1;i++){
                            oldaddress = oldrecordObj.getSublistValue({
                            sublistId: "addressbook",
                            fieldId: "addressbookaddress_text",
                            line: i
                        });
                       
                    }
                    log.debug("old address:",oldaddress);
                        //Retrieving the new record address
                    let newaddress;
                    for (i = 0;i<count2;i++){
                        newaddress = newrecordObj.getSublistValue({
                            sublistId: "addressbook",
                            fieldId: "addressbookaddress_text",
                            line: i
                        });                       
                    }
                    log.debug("new address:",newaddress);
                    //when a new address line is added
                    // if(count2 > count1){
                     
                    // }
                    if(newaddress !== oldaddress){
                        newrecordObj.setValue({
                            fieldId: "custentity_jj_ue_address_change_otp7436",
                            value: true,
                            ignoreFieldChange: true
                        });
                        
                        address_changed = newrecordObj.getValue({
                        fieldId: 'custentity_jj_ue_address_change_otp7436',
                        ignoreFieldChange: true
                        });
                        log.debug(" new value",address_changed);

                    }
                    else{
                        newrecordObj.setValue({
                            fieldId: "custentity_jj_ue_address_change_otp7436",
                            value: false,
                            ignoreFieldChange: true
                        });
                    
                         address_changed = newrecordObj.getValue({
                            fieldId: 'custentity_jj_ue_address_change_otp7436'
                            });
                            log.debug(" new value",address_changed);
                        
                    }

              

                
            }
            catch(e){
                log.error("error on afterSubmit",e.message);

            }
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        //  const afterSubmit = (scriptContext) => {
            

         
        // }

        return {beforeSubmit}

    });
