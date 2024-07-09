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
            let xoobj =  search.create({
                type: search.Type.CREDIT_MEMO,
                filters: 
               [["type","anyof","CustCred"],"AND",["status","anyof","CustCred:A"],"AND",["entity","anyof",1243],"AND",["mainline","is","T"]],
               columns: [
                   {name:'tranid',label:"Document number"},
                   {name:'trandate',label:"Date"},
                   {name:'entity',label:"Customer Name"},
                   {name:'status',label:"Status"},
                   {name:'amountremaining',label:"Amount"}

                ],
                title:"JJ UE Credit Memo Search OTP-7436",
                id: "customsearch_jj_ue_cm_sea_otp7436",
                isPublic: false
            });

            let searchResults = xoobj.run().getRange({
                start: 0,
                end: 5
            });
    
            searchResults.forEach(function(result){
                let sales = {
                    docno: result.getValue({ name: 'tranid' }),
                    trandate: result.getValue({ name: 'trandate' }),
                    entity: result.getText({ name: 'entity' }),
                   status: result.getValue({ name: 'status' }),
                   amountremaining: result.getValue({ name: 'amountremaining' })
                };
                log.debug("document no " + sales.docno + ", date" + sales.trandate + ", customer " + sales.entity + ", Status " + sales.status + ", amount " + sales.amountremaining);
    
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
