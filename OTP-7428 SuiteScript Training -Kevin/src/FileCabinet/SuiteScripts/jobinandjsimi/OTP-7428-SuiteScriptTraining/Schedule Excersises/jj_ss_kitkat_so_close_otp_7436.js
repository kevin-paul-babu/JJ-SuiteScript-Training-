/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
 
        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) =>
        {
        try{   let objSearch = search.create(
            {
                type: search.Type.SALES_ORDER,
                filters: [['item','is','829'], 'AND', ['trandate', 'onorbefore', 'fourdaysago']],
                columns: ['internalid','entity','tranid']
            });
            let searchResultSet = objSearch.run();
            log.debug("Search result", searchResultSet);
            searchResultSet.each(function(searchResult)
            {
                let salesOrderId = searchResult.id;
                log.debug("SO internal Id", salesOrderId);
                let salesOrderRecord = record.load({
                    type: record.Type.SALES_ORDER,
                    id: salesOrderId
                });
                //let subListId = 'item';
                let lineCount = salesOrderRecord.getLineCount({sublistId: 'item'});
                log.debug("Line Count", lineCount);
                for( let i = 0;i < lineCount; i++)
                {
                    let itemLine= salesOrderRecord.getSublistValue({sublistId:'item', fieldId:"item",line:i});
                    log.debug("Line Item", itemLine);
                    if(itemLine == 829)
                    {
                        let isClosed = salesOrderRecord.getSublistValue({sublistId:'item', fieldId:'isclosed',line: i});
                        log.debug("Working", isClosed);
                        if(!isClosed)
                        {
                            log.debug('isClosed');
                            salesOrderRecord.setSublistValue({sublistId:'item', fieldId:'isclosed', line: i, value: true});
                            //let isClosed1 = salesOrderRecord.getSublistValue({sublistId:'item', fieldId:'isclosed',line: i});
                            log.debug('isClosed');
                        }
                    }
                   
                }
                //salesOrderRecord.save();
                let SalesOrderId =salesOrderRecord.save();
                log.debug("Sales Order" +SalesOrderId);
                // let internalId = searchResult.getValue({name :'internalid'});
                // log.debug('Internal Id', internalId);
                // searchResult.setValue({fieldId:'status',value:'SalesOrd:H'});
                return true;
            });
        }catch(e){
          log.error("error",e.message);
        }
        }
 
        return {execute}
 
    });
    
