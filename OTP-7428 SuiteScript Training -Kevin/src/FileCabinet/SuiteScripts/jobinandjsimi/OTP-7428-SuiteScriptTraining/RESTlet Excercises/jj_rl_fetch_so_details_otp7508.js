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
        function SalesOrderdetails(salesOrderId){
            if(!salesOrderId){
                return 'Result Not Found';
            }
            else{
                let salesOrderRecord = record.load({
                     type: search.Type.SALES_ORDER,
                     id: salesOrderId,
                    });
                    let count = salesOrderRecord.getLineCount({
                        sublistId: "item"
                    });
                    log.debug("count",count);
                    for(let i = 0;i<count;i++)
                        {
                        let itemname = salesOrderRecord.getSublistValue({
                            sublistId: "item",
                            fieldId: "item",
                            line:i
                        });
                        let itemqty = salesOrderRecord.getSublistValue({
                            sublistId: "item",
                            fieldId: "quantity",
                            line:i
                        });
                        let itemrate = salesOrderRecord.getSublistValue({
                            sublistId:"item",
                            fieldId:"rate",
                            line:i
                            });
                        let itemgrossamt = salesOrderRecord.getSublistValue({
                            sublistId:"item",
                            fieldId:"grossamt",
                            line:i
                            });
                            salesDetails ={
                                 ItemName:itemname,
                                 Quantity:itemqty,
                                 Rate:itemrate,
                                 GrossAmount:itemgrossamt
                                }
                        }
                    return salesDetails;
            }
        }
        function ListOpenSalesOrders(){
            let salesOrderSearch = search.create({
                type: search.Type.SALES_ORDER,
                filters:
                [
                    ["status","noneof","SalesOrd:G","SalesOrd:C","SalesOrd:H"],
                    "AND",
                    ['mainline','is','T']
                ],
                columns: ['tranid','internalid','trandate','total']
            });
            log.debug("sales",salesOrderSearch);
            let soDetails=[];    
            salesOrderSearch.run().each(function(result)
            {
                soDetails.push({
                    soid:result.getValue('internalid'),
                    docno:result.getValue('tranid'),
                    date:result.getValue('trandate'),
                    total:result.getValue('total')
            });
                log.debug(soDetails);
               return true

              
            });
            if(soDetails){
                return soDetails
            }
            else{
                return "Result Not Found"
            }

        }
        const get = (requestParams) => {
            try{
                if(requestParams.id){
                    let salesOrderId = requestParams.id;
                   return SalesOrderdetails(salesOrderId);
                }
                else{
                    return ListOpenSalesOrders();
                }
               
        }catch(e){
            log.error("error",e.message);
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

        return {get}

    });
