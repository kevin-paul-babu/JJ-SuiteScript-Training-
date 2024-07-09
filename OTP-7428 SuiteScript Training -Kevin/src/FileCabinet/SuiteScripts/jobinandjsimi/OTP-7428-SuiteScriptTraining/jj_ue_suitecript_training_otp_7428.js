/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record'],
    
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
        //     let objRecord = record.create({
        //         type: record.Type.CUSTOMER,
        //         isDynamic: true,
        //         defaultValues: { 
        //             'subsidiary':1   
        //         }
        //     });
        //     objRecord.setValue({
        //         fieldId: 'companyname',
        //         value: "Kevin Babu",
        //         ignoreFieldChange: true
        //     });
        //     objRecord.setValue('email',"kevin@test.com");
        //     objRecord.setValue('phone',123456789);


        //     let recordId = objRecord.save({
        //         enableSourcing: true,
        //         ignoreMandatoryFields: true
        //     });
        //     log.debug("recordID", recordId);

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
