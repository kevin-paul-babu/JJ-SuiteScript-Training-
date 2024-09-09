/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define([ 'N/currentRecord', 'N/email', 'N/log', 'N/record', 'N/runtime', 'N/search','N/file'],
    /**
 * @param{certificate} certificate
 * @param{currentRecord} currentRecord
 * @param{email} email
 * @param{log} log
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    ( currentRecord, email, log, record, runtime, search, file) => {
        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {
        try{
            log.debug("hello");
            return  search.create({
            type: search.Type.SALES_ORDER,
            filters: [
                // Add necessary filters here, for example, orders created in the last 7 days
                ['trandate', 'within', 'lastmonth'],'AND',[
                    'mainline','is','True']
            ],
            columns: [
               'entity','salesrep',
              'tranid',
              'total',
            ],
       
        });
              
      
  
        }catch(e){
            log.error("error details",e.message)
         }
        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
            try{
        
                
                let result = JSON.parse(mapContext.value);
                let customerId = result.values.entity.value;
                let salesRepId = result.values.salesrep.value;
                log.debug(' customerId', customerId);
                log.debug('salesRepId', salesRepId);
            
                let recobj = record.load({
                    type: record.Type.CUSTOMER,
                    id: customerId,
                   
                });

                // let email = recobj.getValue('email');
                // let customerName = recobj.getValue('entityid');


                let details = {
                    documentNo:result.values.tranid,
                    customer:recobj.getText('entityid'),
                    email :recobj.getText('email'),
                    amount:result.values.total
                };

   log.debug('Details', details);
                return mapContext.write({
                    key: salesRepId ||"No Sales Rep",
                    value: details
                });

           
          
}catch(e){
    log.error("error details",e.message)
 }
           
        }

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {
            try{
                let salesrepresnt = reduceContext.key;
                let salesDetails  = reduceContext.values.map(function(value){
                    return JSON.parse(value);
                });
                log.debug('details',salesDetails);
                let csvContent = "Sales Order Document No,Customer,Customer Email,Sales Order Amount\n";
                salesDetails.forEach(function(details){
                    csvContent += details.documentNo+','+details.customer+','+details.email+','+details.amount+'\n';
                    
                });

         let csvFile = file.create({
            name: 'sales_data.csv',
            fileType: file.Type.CSV,
            contents: csvContent,
            folder: -15  // Set appropriate folder ID
        });
        let csvFileId = csvFile.save();

          if(salesrepresnt === "No Sales Rep"){
            email.send({
                author: -5,
                body:"Assign a sales representative to the following customers:\n' "+ csvContent,
                recipients:'ss2expdev051424csf@netsuite.com',
                subject:"No Sales Rep",
                attachments:[file.load({
                    id:csvFileId
                })]
            });
          }
else{
    email.send({
    author: -5,
    body: "Sales Orders Previous Month By Sales Rep",
    recipients: salesrepresnt,
    subject:"Sales Orders Previous Month",
    attachments:[file.load({
        id:csvFileId
    })]
 })
          }
         
        }catch(e){
            log.error("error details",e.message+e.stack)
         }
        }


        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {
         try{
            if (summaryContext.inputSummary.error) {
                log.error('Input Error', summaryContext.inputSummary.error);
            }
    
            summaryContext.mapSummary.errors.iterator().each(function(key, error, executionNo) {
                log.error('Map Error for key: ' + key, error);
                return true;
            });
    
            summaryContext.reduceSummary.errors.iterator().each(function(key, error, executionNo) {
                log.error('Reduce Error for key: ' + key, error);
                return true;
            });
         }catch(e){
            log.error("error details",e.message+e.stack)
         }
    
        }

        return {getInputData, map, reduce, summarize}

    });