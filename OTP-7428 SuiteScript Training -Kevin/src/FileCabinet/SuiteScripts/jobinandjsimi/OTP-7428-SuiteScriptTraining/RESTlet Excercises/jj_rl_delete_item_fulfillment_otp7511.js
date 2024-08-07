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
 * Author : Jobin and Jismi IT Services
 * 
 * Date Created : 6 August 2024
 * 
 * Description : he application needs to delete the item fulfilment record using the API. The id of the item fulfilment to delete will be passed in the DELETE HTTP request, so the API should delete the correct item fulfillment.
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
        // const put = (requestBody) => {

        // }

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
        const doDelete = (requestParams) => {
            let deleteObj = record.delete({
                type:"itemfulfillment",
                id: requestParams.id
            });
            return "deleted";
        }
      

        return {delete: doDelete}

    });
