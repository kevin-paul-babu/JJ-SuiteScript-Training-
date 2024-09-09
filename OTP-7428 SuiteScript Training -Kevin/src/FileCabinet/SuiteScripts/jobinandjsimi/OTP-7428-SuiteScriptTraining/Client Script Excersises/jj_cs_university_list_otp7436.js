/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/url'],
/**
 * @param{currentRecord} currentRecord
 * @param{url} url
 */
function(currentRecord, url) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
    window.onbeforeunload=null;
    }

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
     try {
        console.log("trriggerd");
        let currentRec = scriptContext.currentRecord;
        let countryv = currentRec.getText("custpage_country");
        console.log("country",countryv);
        document.location = url.resolveScript({
            deploymentId: "customdeploy_jj_sl_univlist_otp7436",
            scriptId: "customscript_jj_sl_univlist_otp7436",
            params: {
                countryValue:countryv
            }
        });
     } catch (e) {
        console.log("error",e.message);
     }

    }


    return {
        pageInit: pageInit,
        fieldChanged:fieldChanged
    };
    
});
