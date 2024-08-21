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

        /** 
         * Defines the function to send email from NetSuite Admin to Customer with subject and attachment
         * @param {Object} 
         **/
        function sendAdminEmailAlert(customerName,csvFileId, customerId,) {
            let eBody = '<p>Dear'+customerName+',<p>'+'<p>\n</p>'+'<p>There are invoices that are overdue previous month</p>'+'<p>\n</p>'+'Best Regards'+'<p>\n</p>'+"Cathy Cadigan";
            email.send({
                author: -5,
                body: eBody,
                recipients: customerId,
                subject: "Invoice Overdue Alert",
                attachments: [file.load({
                    id: csvFileId
                })]
                
            })
        }
              const getInputData = (inputContext) => {
            try
            {
                return  search.create({
                    type: search.Type.INVOICE,
                    filters: [['trandate','onorbefore','lastmonth'],"AND",['daysoverdue','greaterthan',0],"AND",['mainline','is','T']],
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
                let overdue = result.values.daysoverdue;
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
                let csvContent = 'Customer Name,Customer Email,Invoice Document No,Invoice Amount,DaysOverdue\n';
                Details.forEach(function(data){
                    csvContent+=data.customer+','+data.customerEmail+','+data.invoicedocno+','+data.invoiceTotal+','+data.overDue+'\n';
                });
                let csvFile = file.create({
                    name: 'customer_overdue_invoices'+customerId+".csv",
                    fileType: file.Type.CSV,
                    contents: csvContent,
                    folder: -15,
                });
                let csvFileId = csvFile.save();
                let lookupsearchObj = search.lookupFields({
                    type: record.Type.CUSTOMER,
                    id: customerId,
                    columns: ['salesrep','entityid']
                 });
                let customerName = lookupsearchObj.entityid;
                if (lookupsearchObj.salesrep && lookupsearchObj.salesrep.length > 0) {
                    salesRep = lookupsearchObj.salesrep[0].value;
                    salesrep = lookupsearchObj.salesrep[0].text;
                    let eBody = '<p>Dear'+customerName+',<p>'+'<p>\n</p>'+'<p>There are invoices that are overdue previous month</p>'+'<p>\n</p>'+'Best Regards'+'<p>\n</p>'+salesrep;
                    email.send
                    ({
                        author: salesRep,
                        body: eBody,
                        recipients: customerId,
                        subject: "Invoice Overdue Alert",
                        attachments: [file.load({
                            id: csvFileId
                        })]
                    });
                }
                else{
                    sendAdminEmailAlert(customerName,csvFileId, customerId)
                }                  
            }catch(e)
            {
                log.error("error on reduce",e.message, e.stack)
            }

        }

        return {getInputData, map, reduce}

    });
