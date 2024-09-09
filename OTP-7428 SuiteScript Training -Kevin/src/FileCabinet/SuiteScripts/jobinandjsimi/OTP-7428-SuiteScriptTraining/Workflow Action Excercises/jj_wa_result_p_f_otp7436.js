/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/currentRecord', 'N/record'],
    /**
 * @param{currentRecord} currentRecord
 * @param{record} record
 */
    (currentRecord, record) => {
        /**
         * Defines the WorkflowAction script trigger point.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.workflowId - Internal ID of workflow which triggered this action
         * @param {string} scriptContext.type - Event type
         * @param {Form} scriptContext.form - Current form that the script uses to interact with the record
         * @since 2016.1
         */
        const onAction = (scriptContext) => {
          try
          {
            let currentobj = scriptContext.newRecord;
           // log.debug("currentobj",currentobj);
            let number  = currentobj.getValue({fieldId:'custbody_jj_wa_number_otp7436'});
            currentobj = Number(currentobj);
            log.debug("Number",number);
            let result='';
            result = number >= 100 ? 'Result: Passed' : 'Result: Failed';
            log.debug("result",result);
            return result;
          }catch(e){
            log.error("error",e.message);
          }
        }

        return {onAction};
    });
