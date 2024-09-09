/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search','N/email','N/runtime'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search, email,runtime) => {
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
            recid = scriptContext.newRecord;
            let cusid = recid.getValue({fieldId:'entity'});
            log.debug("cusid",cusid);
            let itemid = recid.getSublistValue({
                sublistId: 'item',
                line:0,
                fieldId: 'item'
            });
            log.debug("itemid",itemid);
             
            let recobj = record.load({
                type: record.Type.INVENTORY_ITEM,
                id: itemid,
                isDynamic:true
               });
               //let recid = recobj.id;
            log.debug("recobj",recobj.id);
            let vend = recobj.getSublistValue({
                sublistId: 'itemvendor',
                line:0,
                fieldId:'preferredvendor'
            })
            log.debug("vend",vend);
            if(vend){
             let message = " Preferred Vendor is added";
             log.debug("message",message);
            }
            else {
                message = 'No Preferred Vendor.Please Update Vendor';
            }
            //let value = prefv.getValue({fieldId:'preferredvendor'});
            //log.debug("value",value);
            let currentUser = runtime.getCurrentUser();
             let currid = currentUser.id;
             email.send({
                author: currid,
                body:message,
                recipients: currentUser.email,
                subject:"preferred vendor"
             })
           }catch(e){
             log.error("error",e.message);
           } 
           
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
