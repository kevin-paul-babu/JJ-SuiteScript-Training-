/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record) => {
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
           let recobj = record.load({
            type:record.Type.CUSTOMER,
            id: 1245,
            isDynamic:true
           });
         
          

           let srep = recobj.getText('salesrep');
           let cname = recobj.getText('companyname');
           let subsidiary = recobj.getText('subsidiary');
           let email = recobj.getText('email');
           let phone =  recobj.getValue('phone');
           log.debug("salesrep",srep);
           log.debug("company name",cname);
           log.debug("subsidiary",subsidiary);
           log.debug("email",email);
           log.debug("phone",phone);
           
           



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
