/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/record', 'N/search'],
/**
 * @param{currentRecord} currentRecord
 * @param{record} record
 * @param{search} search
 */

function(currentRecord, record, search) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    // function pageInit(scriptContext) {

    // }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {

    try{
        let currentRec = scriptContext.currentRecord;
        let fieldId = scriptContext.fieldId;

        if(fieldId === 'quantity'){

            let item = currentRec.getCurrentSublistValue({
                sublistId:'item',
                fieldId:'item'
            });
            log.debug('Item: ',item);

            let loc = currentRec.getValue('location');
            log.debug('Location :',loc);

            let quan = currentRec.getCurrentSublistValue({
                sublistId:'item',
                fieldId:'quantity'
            });


            let itemQuan;

            let itemSrch = record.load({
                type: record.Type.ITEM,
                id:item,
                
            });

            itemQuan = itemSrch.getCurrentSublistValue({
                sublistId:'location',
                fieldId:'quantityavailable'
            });



            // let itemSrch = search.create({
            //     type:search.Type.ITEM,
            //     filters:[['internalid','is',item],"AND",['location','is',loc]],
            //     columns: ['quantityavailable'],
            // })
            // let salesOrderResults = itemSrch.run().getRange({
            //     start: 0,
            //     end: 1000 // Adjust this as needed
            // });
       
            // salesOrderResults.forEach(function(result) {
            //      itemQuan= result.getValue('quantityavailable');
             
            //    });           
            log.debug('Item Avaialble',itemQuan);

            currentRec.setCurrentSublistValue({
                sublistId:'item',
                fieldId:'custcol_item_avail',
                value: itemQuan
            });

            if(itemQuan > quan){

                currentRec.setValue('custbody_avail_status',"Available");
            }
            else{
                currentRec.setValue('custbody_avail_status',"Backordered");
            };
        };
   
    
    }catch(e){
        log.error("error",e.message);
    }
   
    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    // function postSourcing(scriptContext) {

    // }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    // function sublistChanged(scriptContext) {

    // }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    // function lineInit(scriptContext) {

    // }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    // function validateField(scriptContext) {

    // }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    // function validateLine(scriptContext) {

    // }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    // function validateInsert(scriptContext) {

    // }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    // function validateDelete(scriptContext) {

    // }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {
        let currentRec = scriptContext.currentRecord;
        let itemStatus = currentRec.getValue('custbody_avail_status');

        if(itemStatus !== 'Available'){
           
            alert('The Sufficient Quantity is not Available.');
            return false;
        };

        return true;

    }

    return {
       
        fieldChanged: fieldChanged,
        saveRecord: saveRecord
    };
    
});
