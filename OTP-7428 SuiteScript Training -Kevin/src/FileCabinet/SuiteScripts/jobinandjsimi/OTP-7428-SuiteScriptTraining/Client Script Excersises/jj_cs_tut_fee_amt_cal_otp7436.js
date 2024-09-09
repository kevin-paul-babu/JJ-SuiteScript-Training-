/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/error', 'N/https', 'N/record', 'N/search', 'N/ui/message', 'N/url'],
/**
 * @param{error} error
 * @param{https} https
 * @param{record} record
 * @param{search} search
 * @param{message} message
 * @param{url} url
 */
function(error, https, record, search, message, url) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
 

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
    //  * @since 2015.2
     */  
    function fieldChanged(scriptContext) {
        try{
            let currentRecord = scriptContext.currentRecord;
            log.debug("hello");
            log.debug(currentRecord);
            let fieldID = scriptContext.fieldId;
                let lang = currentRecord.getValue('custrecord_jj_tut_lang_course_otp7436');
                log.debug("lang",lang);
                let feeSearchObj = search.create({
                    type: 'customrecord_jj_tut_fee_det_otp7436',
                    filters:['custrecord_jj_tut_fee_course_det_otp7436','is',lang],
                    columns:['custrecord_jj_tut_fee_amt_det_otp7436']
   
                });
                let results = feeSearchObj.run().getRange({
                    start: 0,
                    end: 1
                });
                let feeAmount;
                results.forEach(function(result){
                    feeAmount = result.getValue('custrecord_jj_tut_fee_amt_det_otp7436');       
                    return true;      
                });
                log.debug("fee amt",feeAmount);  
                let transactionCurrency = currentRecord.getText('custrecord_jj_tut_lang_transcurr_otp7436');
                log.debug("transcr",transactionCurrency);
                if(feeAmount && transactionCurrency){
                let headersRequest = {
                    'Content-Type': 'application/json'
                }
                let apiUrl = "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_9YbQtanAqpYwy8475QRWA7fJotFsvOF8Mqo6KccW&currencies="+transactionCurrency+"&base_currency=INR"
                 let response = https.request({
                    method:https.Method.GET,
                    url: apiUrl,
                    body:transactionCurrency,
                    headers: headersRequest
                });
                if(response.code == 200){
                let exchangerateResponse = JSON.parse(response.body);
                let exchangeRate = exchangerateResponse.data[transactionCurrency];
                let calAmount = feeAmount * exchangeRate;
                currentRecord.setValue({
                    fieldId:custrecord_jj_tut_lang_fee_otp7436,
                    value: calAmount,
                    ignoreFieldChange: true,
                });
                currentRecord.setValue({
                    fieldId:custrecord_jj_tut_lang_ex_rate_otp7436,
                    value: exchangeRate,
                    ignoreFieldChange: true,
                });
                log.debug(exchangerateResponse.data[transactionCurrency]);

                }
                else{
                    log.debug("API failed");
                }
                
                /*https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_9YbQtanAqpYwy8475QRWA7fJotFsvOF8Mqo6KccW&currencies=&base_currency=INR*/
           
                
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
   

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
 

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */


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

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
  

    return {
      
        fieldChanged: fieldChanged,
    

    };
    
});
