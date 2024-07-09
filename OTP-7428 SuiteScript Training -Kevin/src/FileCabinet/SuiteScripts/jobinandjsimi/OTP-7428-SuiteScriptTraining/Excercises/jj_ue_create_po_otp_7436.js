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
            let poobj = record.create({
                type: record.Type.PURCHASE_ORDER,
                isDynamic: true
           });
           
           poobj.setValue({
            fieldId: 'entity', // Customer
            value: 1663 // Customer Internal ID
        });
        
        poobj.selectNewLine({
            sublistId: 'item'
        });
        poobj.setCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'item',
            value: 53 // Item Internal ID
        });
        poobj.setCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'quantity',
            value: 2 // Quantity
        });

        poobj.commitLine({
            sublistId: 'item'
        });

        var poobjId = poobj.save();
        log.debug('Purchase Order Created', 'Purchase Order ID: ' + poobjId);

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
