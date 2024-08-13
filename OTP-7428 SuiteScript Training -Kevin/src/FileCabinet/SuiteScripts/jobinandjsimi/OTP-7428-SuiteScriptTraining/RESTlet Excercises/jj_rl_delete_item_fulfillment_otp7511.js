/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
/**************************************************
 * SuiteScript Training
 * OTP-7511 : Creating API for deleting the item fufillment
 * 
 * *******************************************************************
 * 
 * Author : Jobin and Jismi IT Services LLP.
 * 
 * Date Created : 6 August 2024
 * 
 * Description : he application needs to delete the item fulfilment record using the API. The id of the item fulfilment to delete will be passed in the DELETE HTTP request, so the API should delete the correct item fulfillment.
 * REVISION HISTORY 
 * @version  1.0 : 6 August 2024 : Created the intial build  by  JJ0341 
 * 
 **********************************************************************************************/
define(['N/record'],
    /**
 * @param{record} record

 */
    (record) => {

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {
        try{
            let id = requestParams.id;
            log.debug(id);
            record.delete({
                type: record.Type.ITEM_FULFILLMENT,
                id: requestParams.id
            });
            return requestParams.id;
        }catch(e){
            log.error("error",e.message);
        }
        }
      

        return {delete: doDelete}

    });
