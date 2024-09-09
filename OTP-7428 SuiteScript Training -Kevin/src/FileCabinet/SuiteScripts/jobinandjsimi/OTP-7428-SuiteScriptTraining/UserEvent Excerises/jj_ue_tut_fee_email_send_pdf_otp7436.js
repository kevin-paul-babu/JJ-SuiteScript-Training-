/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/email', 'N/file', 'N/record', 'N/render', 'N/runtime','N/search','N/https'],
    /**
 * @param{email} email
 * @param{file} file
 * @param{record} record
 * @param{render} render
 * @param{runtime} runtime
 * @param{search} search
 * @param{https} https
 */
    (email, file, record, render, runtime, search, https) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        // const beforeLoad = (scriptContext) => {

        // }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {
            try{
                let newRecord = scriptContext.newRecord;
                log.debug("hello");
                log.debug(newRecord);
                let fieldID = scriptContext.fieldId;
                    let lang = newRecord.getValue('custrecord_jj_tut_lang_course_otp7436');
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
                    let transactionCurrency = newRecord.getText('custrecord_jj_tut_lang_transcurr_otp7436');
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
                    newRecord.setValue({
                        fieldId:'custrecord_jj_tut_lang_fee_otp7436',
                        value: calAmount,
                        ignoreFieldChange: true,
                    });
                    newRecord.setValue({
                        fieldId:'custrecord_jj_tut_lang_ex_rate_otp7436',
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
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        // const afterSubmit = (scriptContext) => {
          
        // }

        return { beforeSubmit}

    });
