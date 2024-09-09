/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(["SuiteScripts/jobinandjsimi/jj_custom_module_otp7436.js"],
    
    (objectNo) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            let total = objectNo.AddNumbers(3,4);
            log.debug("total:",total)
        }

        return {execute}

    });
