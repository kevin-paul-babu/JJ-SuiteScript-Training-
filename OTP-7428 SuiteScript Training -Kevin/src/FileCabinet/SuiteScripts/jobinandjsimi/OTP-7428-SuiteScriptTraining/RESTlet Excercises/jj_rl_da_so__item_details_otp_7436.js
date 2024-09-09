/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
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
        const get = (requestParams) => {
            try{
                let recid =requestParams.id;
                var ssoobj = search.create({
                    type: "salesorder",
                    settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
                    filters:
                    [
                       ["type","anyof","SalesOrd"], 
                       "AND", 
                       ["internalid","anyof",recid], 
                       "AND", 
                       ["mainline","is","F"]
                    ],
                    columns:
                    [ 
                       search.createColumn({name: "item", label: "Item"}),
                       search.createColumn({name: "rate", label: "Item Rate"}),
                       search.createColumn({name: "quantity", label: "Quantity"}),
                       search.createColumn({
                          name: "formulanumeric",
                          formula: "{rate}*{quantity}",
                          label: "Amount"
                       })
                    ]
                 });
                 var searchResultCount = ssoobj.runPaged().count;
                 log.debug("salesorderSearchObj result count",searchResultCount);
                 let message;
                 if (searchResultCount >2){
                  message = "The Sales Order "+ recid+"has more than 2 orders";
                 }
                 else{
                    //message = "The Sales Order "+ recid+"has more than 2 orders";
                 }
                
                 let results;
                 let itemName;
                 let qty;
                 let rate;
                 let amount;
                 let sales =[];
                
                results = ssoobj.run()
                // .getRange({
                //     start: 0,
                //     end: 100
                // });
                results.each(function(result){
                    // .run().each has a limit of 4,000 results
                    qty       =  result.getValue(ssoobj.columns[2]);
                    rate      =  result.getValue(ssoobj.columns[1]);
                    itemName  =  result.getText(ssoobj.columns[0]);
                    amount    =  result.getValue(ssoobj.columns[3]);

                    //let name  = result.getText(ssoobj.columns[0]);
                    //     results.push({
                    //     itemName : result.getText({ name: 'item' }),
                    //     qty : result.getValue({ name: 'quantity' }),
                    //     rate :result.getValue({ name: 'rate' }),
                    //     amount : result.getValue({ name: 'formulanumeric' })
                    // });
                    
                     let sale = {
                        "itemname":itemName,
                        "quantity":qty,
                        "rate":rate,
                        "amount":amount,
                             
                    }
                    sales.push(sale);
                    log.debug("sales",sales);

                    return true;
                    
                    //return true;
                 });

                 return {
                    message: message,
                    sales: sales
                };
                
                 //log.debug("message",message);
            }catch(e){
                log.error("error",e.message)
            }
        }

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
            let invid = requestBody.pid;
            let memo = requestBody.memo;
            let emp = requestBody.e;
            let loc = requestBody.loc;

            record.submitFields({
             type: record.Type.PURCHASE_ORDER,
             id: invid,
             values: {
                 'memo' : memo,
                 'employee' : emp,
                 'location':loc
             },
             ignoreFieldChange: true
         });
         return 'Updated'
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
        const post = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {

        }

        return {get, put, post, delete: doDelete}

    });
