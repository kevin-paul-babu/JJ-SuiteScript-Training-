/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
/**************************************************
 * SuiteScript Training
 * OTP-7508 : Creating API for creating  the Item fulfillment
 * 
 * *******************************************************************
 * 
 * Author : Jobin and Jismi IT Services
 * 
 * Date Created : 5 August 2024
 * 
 * Description : The application needs to fetch the list of sales order details with an open status. The details should include the following: internal ID, document number, date, and total amount. The data should be in a JSON object. The application will use the API for fetching the sales order whose status is open.
 * The application needs to fetch the single sales order with item details (item name, quantity, rate, gross amount). The internal id of the sales order will be passed as a parameter in the API. The application needs to use the API for fetching the single sales order. If no sales order is found for the parameter id, then the message "RESULT: NOT FOUND needs to be shown.
 * REVISION HISTORY 
 * @version  1.0 : 5 August 2024 : Created the intial build  by  JJ0341 
 * 
 * 
 * 
 **********************************************************************************************/
define(['N/currentRecord', 'N/record', 'N/search',],
    /**
 * @param{currentRecord} currentRecord
 * @param{record} record
 * @param{search} search
 */
    (currentRecord, record, search) => {
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
        const post = (requestBody) => {
            try{
                let salesorderID = requestBody.salesOrderId;
                let soDetails    = requestBody.soDetails;
                // let count = requestBody.lineCount;
                log.debug("salesorderId",salesorderID);
                log.debug(soDetails);
                if(!salesorderID||!soDetails||!Array.isArray(soDetails)){
              
                    log.debug("error in the requestBody");
                
                }
                let itemFulfill;
                itemFulfill = record.transform({
                    fromType:record.Type.SALES_ORDER,
                    fromId: salesorderID,
                    toType: record.Type.ITEM_FULFILLMENT,
                    isDynamic: true
                });
                let lineCount = itemFulfill.getLineCount({
                    sublistId: "item"
                });
                log.debug(lineCount);
                for(let i = 0;i<lineCount;i++){
                    itemFulfill.setCurrentSublistValue({
                        sublistId: "item",
                        fieldId: "quanity",
                        value: soDetails.quantity,
                        ignoreFieldChange: true
                    });
                }
                    itemFulfill.commitLine({
                        sublistId: "item",
                        ignoreRecalc: true
                    });
                    itemFulfill.setValue({
                        fieldId:"status",
                        value:"SalesOrd:F"
                    })
                    let recordId  = itemFulfill.save({
                        'enableSourcing':true,
                        ignoreMandatoryFields:false
                    });
                    return recordId;
            
       
            }catch(e){
                log.error("error",e.message);
            }
        }

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

        return { post}

    });
