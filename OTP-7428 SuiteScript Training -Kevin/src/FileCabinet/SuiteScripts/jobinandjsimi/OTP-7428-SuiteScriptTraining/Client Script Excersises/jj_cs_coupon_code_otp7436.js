/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/record'],
/**
 * @param{currentRecord} currentRecord
 * @param{record} record
 */
function(currentRecord, record) {
    
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
        let currentRec = scriptContext.currentRecord;
        let fieldId = scriptContext.fieldId;
 
        if(fieldId === 'custentityjj_apply_coup_otp7436'){
 
            let applyCoupon = currentRec.getValue('custentityjj_apply_coup_otp7436');
            console.log('Apply:',applyCoupon);
 
            if(applyCoupon){
                currentRec.getField('custentityjj_coup_code_otp7436').isDisabled= false;
                // setFieldDisplayType(currentRec, form, 'custentityjj_coup_code_otp7436', 'normal');
            } else
           
            {
 
                currentRec.setValue('custentityjj_coup_code_otp7436','');
                currentRec.getField('custentityjj_coup_code_otp7436').isDisabled= true;
                // setFieldDisplayType(currentRec, form, 'custentityjj_coup_code_otp7436', 'disabled');
            }
 
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
    //  */
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
        let applyCoupon = currentRec.getValue('custentityjj_apply_coup_otp7436');
        console.log("applyCoupon");
 
        let couponCode = currentRec.getValue('custentityjj_coup_code_otp7436');
        console.log("couponCode");
 
        if(applyCoupon && (!couponCode || couponCode.length !== 5)){
 
            alert('Coupon Code must be 5 characters long.');
            return false;
        }
 
        return true;
    }

    return {
       
        fieldChanged: fieldChanged,
        saveRecord: saveRecord
    };
    
})
