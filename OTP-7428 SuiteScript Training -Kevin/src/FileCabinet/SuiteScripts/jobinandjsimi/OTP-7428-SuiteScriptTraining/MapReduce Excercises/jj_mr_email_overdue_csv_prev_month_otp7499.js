/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
/**************************************************
 * SuiteScript Training
 * OTP-7499 : Monthly OverDue Reminder For Customer
 * 
 * *******************************************************************
 * 
 * Author : Jobin and Jismi IT Services LLP.
 * 
 * Date Created : 30 July 2024
 * 
 * Description : Email Notification to Customers having Overdue Invoices
 * REVISION HISTORY 
 * @version  1.0 : : 30 July 2024 : Created the intial build  by  JJ0341 
 * 
 * 
 * 
 **********************************************************************************************/
define(['N/email', 'N/file', 'N/log', 'N/record', 'N/search'],
    /**
 * @param{email} email
 * @param{file} file
 * @param{log} log
 * @param{record} record
 * @param{search} search
 */
    (email, file, log, record, search) => {
        'use-strict';
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
            try
            {
                return  search.create({
                    type: search.Type.INVOICE,
                    filters: [['trandate','within','lastmonth'],"AND",['daysoverdue','greaterthan',0],"AND",['mainline','is','T']],
                    columns: ['entity','tranid','total','daysoverdue']
                });
            }catch(e){
                log.error("error on getInput",e.message,e.stack);
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
            try
            {
                let result = JSON.parse(mapContext.value)
                let entity = result.values.entity.value;
                let tranid = result.values.tranid;
                let total  = result.values.total;
                //log.debug("total",total);
                let overdue = result.values.daysoverdue;
                //log.debug("overdue",overdue);
                let lookupsearchObj = search.lookupFields({
                    type: search.Type.CUSTOMER,
                    id: entity,
                    columns: ['entityid','email']
                 });
                 let entityname = lookupsearchObj.entityid;
                 let entityemail = lookupsearchObj.email;
                

                 details ={
                    customer : entityname,
                    customerEmail:entityemail,
                    invoicedocno : tranid,
                    invoiceTotal : total,
                    overDue : overdue,
                 }
                 //log.debug("details inv amount",details.invoiceTotal);
                 //log.debug("details  inv overdue",details.overDue);
                 return mapContext.write({
                    key:entity,
                    value:details
                 });
            }catch(e){
                log.error("error on map ",e.message,e.stack);
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
            try
            {
                let customerId = reduceContext.key;
                let Details    = reduceContext.values.map(function(value){
                    return JSON.parse(value);
                })

                let salesRep;
                let csvContent = 'Customer Name,Customer Email,Invoice Document No,Invoice Amount,DaysOverdue\n';
                Details.forEach(function(data){
                    csvContent+=data.customer+','+data.customerEmail+','+data.invoicedocno+','+data.invoiceTotal+','+data.overDue+'\n';
                
                });
                let recordObj = record.load({
                    type: record.Type.CUSTOMER,
                    id: customerId
                });
                salesRep = recordObj.getValue('salesrep');
                log.debug("csvdetails",csvContent);

                let csvFile = file.create({
                    name: 'customer_overdue_invoices'+customerId+".csv",
                    fileType: file.Type.CSV,
                    contents: csvContent,
                    folder: -15,
                });

                let csvFileId = csvFile.save();

                if(salesRep)
                    {
                        email.send
                        ({
                            author: salesRep,
                            body: "Monthly Invoices Overdue",
                            recipients: customerId,
                            subject: "Overdue Alert",
                            attachments: [file.load({
                                id: csvFileId
                            })]
                        })  
                }
                else{
                    email.send({
                        author: -5,
                        body: "Monthly Invoices Overdue",
                        recipients: customerId,
                        subject: "Overdue Alert",
                        attachments: [file.load({
                            id: csvFileId
                        })]
                        
                    })
                }
                                
                
            }catch(e){
                log.error("error on reduce",e.message,e.stack)
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
        // const summarize = (summaryContext) => {

        // }

        return {getInputData, map, reduce}

    });
