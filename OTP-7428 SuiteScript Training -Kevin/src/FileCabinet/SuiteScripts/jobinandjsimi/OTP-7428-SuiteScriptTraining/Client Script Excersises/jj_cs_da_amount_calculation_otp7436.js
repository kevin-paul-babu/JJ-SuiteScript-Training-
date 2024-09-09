/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord'],
/**
 * @param{currentRecord} currentRecord
 * @param{record} record
 */
function(currentRecord) {
    
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
          

            // Check if the changed field is the custom checkbox
    
                  let amtCal;
    
                  if (fieldId === 'custcoljj_amt_cal_da_otp7436' || fieldId === 'rate' || fieldId === 'quantity'){
         
                    amtCal = currentRec.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcoljj_amt_cal_da_otp7436'
                
                   });
                   log.debug('AMount Cal',amtCal);
                     rate = currentRec.getCurrentSublistValue({
                        sublistId: "item",
                        fieldId: "rate"
                    
                       });
                    log.debug("rate",rate);
     
                     quantity = currentRec.getCurrentSublistValue({
                        sublistId: "item",
                        fieldId: "quantity"
                    
                       });
                       log.debug("quantity",quantity);
                       let amt = rate*quantity;
                       let noamt = (rate*quantity)/2;
                   if(amtCal){
                     let amount  = currentRec.setCurrentSublistValue({
                        sublistId: "item",
                        fieldId: "amount",
                        value:noamt                    
                     });
                    
                     log.debug("amount",amount);
                   }

                   else{
                    amount  = currentRec.setCurrentSublistValue({
                        sublistId: "item",
                        fieldId: "amount",
                        value:amt,
                     });
                   
                     log.debug("amount",amount);

                 }
                 currentRec.commitLine({sublistId:'item'});
            }
            else{
                return false;
            }
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
    // function saveRecord(scriptContext) {
     

    // }

    return {
        
        fieldChanged: fieldChanged
    };
    
});
