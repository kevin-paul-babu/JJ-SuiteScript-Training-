/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/email', 'N/file', 'N/record', 'N/search'],
    /**
 * @param{email} email
 * @param{file} file
 * @param{record} record
 * @param{search} search
 */
    (email, file, record, search) => {
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

        let csvContent = 'Sales OrderId,DocumentNo,Customer Name,Total Amount\n';

        function PendingFulSearch(){
            try {
                let searchObj = search.create({
                    type: search.Type.SALES_ORDER,
                    filters: [["mainline","is","T"], 
                    "AND", 
                    ["status","anyof","SalesOrd:B"], 
                    "AND", 
                    ["trandate","onorbefore","thirtydaysago"]],
                    columns: ['internalid','tranid','entity','amount']
                });
                let results = searchObj.run().getRange({
                    start:0,
                    end:1000
                });
                // let details;
                // results.forEach(result => {
                //     details = {
                //     salesorderId:result.getValue({name:"internalid"}),
                //     documentNo:result.getValue({name:"tranid"}),
                //     entity:result.getText({name:"entity"}),
                //     amount:result.getValue({name:"amount"})
                //    }
                //     return true;
                // });
                // log.debug("details",details);
                return results;

            } catch (e) {
                log.debug("error",e.message)
            }
        }

        const getInputData = (inputContext) => {
            try {

                let data =  PendingFulSearch()
                log.debug("data",data)
                return data;
            } catch (e) {
                log.debug("error",e.message+e.stack)
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

        // const map = (mapContext) => {

        // }

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
            try {
                let result = JSON.parse(reduceContext.values);
                //log.debug("result",result);
                let soid = result.values.internalid[0].value;
                log.debug("soid" ,soid);
                let customerId =result.values.entity[0].value;
                //log.debug("customer ID",customerId);
                let customerName = result.values.entity[0].text;
                log.debug("customer",customerName);
                let docNo = result.values.tranid;
                let amount = result.values.amount;
                csvContent += soid+','+docNo+','+customerName+','+amount;
            let recordObj = record.load({
                type: record.Type.SALES_ORDER,
                id: soid,
                isDynamic: true,
            });
            // let customer = recordObj.getText({
            //     fieldId: "entity"
            // });
            // let docno =recordObj.getValue({
            //     fieldId: "tranid"
            // })
            // let amount = recordObj.getValue({
            //     fieldId:"amount"
            // });

            let lineCount = recordObj.getLineCount({
                sublistId: "item"
            });
            for (let i = 0;i<lineCount;i++){
                recordObj.selectLine({
                    sublistId: "item",
                    line: i
                });
                log.debug("load triggering")
                recordObj.setCurrentSublistValue({
                    sublistId: "item",
                    fieldId: "isclosed",
                    line:i,
                    value: true,
                    ignoreFieldChange: true
                });
                recordObj.commitLine({
                    sublistId: "item"
                });
              
            }
 
              
        
            
            log.debug("csv",csvContent);
            let recid = recordObj.save();
            
            reduceContext.write({
                value:csvContent
              });
            } catch(e) {
                log.debug("error on reduce",e.message+e.stack);
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
            try {
                let csvDetails;
            summaryContext.output.iterator().each(function (value){
                csvDetails = JSON.parse(value)
               
                return true;
        });
        log.debug("csvDetails",csvDetails)
        let csvContentD = 'Sales OrderId,DocumentNo,Customer Name,Total Amount\n';
        csvContentD += csvDetails.value;
        log.debug("csvc",csvContentD)
        let csvFile = file.create({
            name: "Closed Sales Order Data",
            fileType:file.Type.CSV,
            contents: csvContentD,
            folder: -15
        });
        let csvFileId = csvFile.save();
        log.debug("csvFileId",csvFileId);

        if(csvFileId){
            email.send({
                author:-5,
                body: "Dear Resoursecs ,We have send the sales orders closed in the csv file attatched\n"+"Thank You",
                recipients: -5,
                subject: "Closed Sales Order ",
                attachments: [file.load({
                    id: csvFileId
                })]
            })

            log.debug("Email is sent to admin");
        }
       
            } catch (e) {
                log.debug("error",e.message+e.stack);
            }
    }

        return {getInputData,  reduce, summarize}

    });
