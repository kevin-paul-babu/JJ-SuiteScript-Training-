/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record'],
    /**
 * @param{record} record
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
           let soobj = record.create({
                type: record.Type.SALES_ORDER,
                isDynamic: true
           });

           soobj.setValue({
            fieldId: 'entity', // Customer
            value: 1245 // Customer Internal ID
        });

        soobj.setValue({
            fieldId: 'location', // Location
            value:1 // Location Internal ID
        });

        soobj.selectNewLine({
            sublistId: 'item'
        });

        soobj.setCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'item',
            value: 53 // Item Internal ID
        });
        soobj.setCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'quantity',
            value: 2 // Quantity
        });
       
        soobj.commitLine({
            sublistId: 'item'
        });

        var soobjId = soobj.save();
        log.debug('Sales Order Created', 'Sales Order ID: ' + soobjId);


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
