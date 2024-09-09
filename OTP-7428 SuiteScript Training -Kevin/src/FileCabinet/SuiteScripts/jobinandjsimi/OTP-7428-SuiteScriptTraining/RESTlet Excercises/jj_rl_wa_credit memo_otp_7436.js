/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record','N/search'],
    /**
 * @param{record} record
 */
    (record,search) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {
           recidId = requestParams.id;
            let recobj = search.lookupFields({
                type: search.Type.CREDIT_MEMO,
                id: recidId,
                columns:['entity','subsidiary','salesrep','location']
            });
           
            let sodetials = {
                custName : recobj.entity[0].text,
                salesrep : recobj.salesrep[0].text,
                location : recobj.salesrep[0].text,
                subsidiary : recobj.subsidiary[0].text,
               }
              
                return sodetials;
                
            

            
     
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
               let invid = requestBody.invid;
               let memo = requestBody.memo;
               let salesrep = requestBody.sp;
               let loc = requestBody.loc;

               record.submitFields({
                type: record.Type.INVOICE,
                id: invid,
                values: {
                    'memo' : memo,
                    'salesrep' : salesrep,
                    'location':loc
                },
                ignoreFieldChange: true
            });


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
            try{
                    let recid = record.create({
                    type: record.Type.CASH_SALE,
                    isDynamic: true
                });
                recid.setValue({
                    fieldId: 'entity', // Customer
                    value: requestBody.cusid // Customer Internal ID
                });

                recid.setValue({
                    fieldId: 'location', //Location
                    value: requestBody.loc 
                });
                recid.selectNewLine({
                    sublistId: 'item'
                });
                recid.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    value: requestBody.item // Item Internal ID
                });
                recid.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: requestBody.qty // Quantity
                });
        
                recid.commitLine({
                    sublistId: 'item'
                });
                
                var recidId = recid.save();
                return('Cash Sale Created Cash SaleID: ' + recidId);

                
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
        const doDelete = (requestParams) => {
            let empid = requestParams.id;
         let del = record.delete({
                type:record.Type.EMPLOYEE,
                id: empid
            });

                return ('success',del);
        }

        return {get, put, post, delete: doDelete}

    });
