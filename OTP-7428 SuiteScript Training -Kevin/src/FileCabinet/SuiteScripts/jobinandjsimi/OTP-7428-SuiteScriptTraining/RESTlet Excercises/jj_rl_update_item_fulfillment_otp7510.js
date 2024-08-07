/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
/**************************************************
 * SuiteScript Training
 * OTP-7510 : Creating API for updating the item fufillment
 * 
 * *******************************************************************
 * 
 * Author : Jobin and Jismi IT Services LLP.
 * 
 * Date Created : 6 August 2024
 * 
 * Description : Update the item fulfilment record as per the body of the PUT HTTP request. The application will call the API for updating the item fulfilment record, and details of the update will be sent as JSON from the application. The API will find the item fulfilment record and update the item fulfilment record.
 * 
 * REVISION HISTORY 
 * @version  1.0 : 6 August 2024 : Created the intial build  by  JJ0341 
 * 
 **********************************************************************************************/
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        // const get = (requestParams) => {

        // }

        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {
            try{
                let itemfulfillId = requestBody.itemfulfillId;
                log.debug(itemfulfillId);
                let ifDetails = requestBody.ifDetails;
                log.debug(ifDetails);
                let fulfillOrder = record.submitFields({
                    type: "itemfulfillment",
                    id: itemfulfillId,
                    values: {
                        'memo':requestBody.memo
                    },
                });
                let itemfulfillSearch = search.lookupFields({
                    type:"itemfulfillment",
                    id: itemfulfillId,
                    columns: ['memo']
                });
                let memo = itemfulfillSearch.memo;
                return memo;
            }catch(e){
                log.error("error",e.message);
            };

        }

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        // const post = (requestBody) => {

        // }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        // const doDelete = (requestParams) => {

        // }

        return {put}

    });
