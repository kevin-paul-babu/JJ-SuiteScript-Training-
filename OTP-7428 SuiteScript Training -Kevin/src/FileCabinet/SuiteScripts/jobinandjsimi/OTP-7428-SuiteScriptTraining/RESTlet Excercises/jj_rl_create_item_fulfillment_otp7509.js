/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
/**************************************************
 * SuiteScript Training
 * OTP-7509 : Creating API for creating  the Item fulfillment
 * 
 * *******************************************************************
 * 
 * Author : Jobin and Jismi IT Services LLP.
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
define(['N/record', 'N/search',],
    /**
 * @param{record} record
 * @param{search} search
 */
    ( record, search) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
       
        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
       

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
                // let recordObj = record.load({
                //     type: record.Type.SALES_ORDER,
                //     id: salesorderID,
                //     isDynamic: true,
                //     defaultValues: Object
                // });
               
                let soDetails    = requestBody.soDetails;
                //let lineCount = requestBody.soDetails.line;
                log.debug("salesorderId",salesorderID);
        
                log.debug(soDetails);

                 if(!salesorderID){
              
                   log.debug("error in the requestBody");  
                
                 }
                 else{
                    let itemFulfill = record.transform({
                        fromType:record.Type.SALES_ORDER,
                        fromId: salesorderID,
                        toType: record.Type.ITEM_FULFILLMENT,
                        isDynamic: true
                    });

                    let lineCount = itemFulfill.getLineCount({
                        sublistId: "item"
                    });
                    log.debug("line count ",lineCount);
                    log.debug(itemFulfill);
                    if(lineCount == 1){
                        for(let i=0;i<soDetails.length;i++){
                            itemLine = soDetails[i];
                        for(let j =0;j<lineCount;j++){
                            itemFulfill.selectLine({
                                sublistId: "item",
                                line: j
                            });
                            let item = itemFulfill.getCurrentSublistValue({
                                sublistId: "item",
                                fieldId: "item"
                            });
                            if(item == itemLine.item){
                                itemFulfill.setCurrentSublistValue({
                                    sublistId: "item",
                                    fieldId: "quantity",
                                    value: itemLine.quantity,
                                    line: i
                                });        
                                itemFulfill.commitLine({
                                    sublistId: "item",
                                });
                            }
                            
                         }
                        }
                        let recordId  = itemFulfill.save({
                            enableSourcing:true,
                            ignoreMandatoryFields:true
                        });
                        return recordId;     
                                          

                   
                    }
                    else{
                            for(let i=0;i<soDetails.length;i++){
                                itemLine = soDetails[i];
                            for(let j =0;j<lineCount;j++){
                                itemFulfill.selectLine({
                                    sublistId: "item",
                                    line: j
                                });
                                let item = itemFulfill.getCurrentSublistValue({
                                    sublistId: "item",
                                    fieldId: "item"
                                });
                                if(item == itemLine.item){
                                    itemFulfill.setCurrentSublistValue({
                                        sublistId: "item",
                                        fieldId: "quantity",
                                        value: itemLine.quantity,
                                        line: i
                                    });        
                                    itemFulfill.commitLine({
                                        sublistId: "item",
                                    });
                                }
                                
                             }
                            }
                            let recordId  = itemFulfill.save({
                                enableSourcing:true,
                                ignoreMandatoryFields:true
                            });
                            return recordId;     
                                              

                        }
                 }
               
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
       

        return { post}

    });
