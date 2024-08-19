/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
/**************************************************
 * SuiteScript Training
 * OTP-7491 : External Custom Record form and actions
 * 
 * *******************************************************************
 * 
 * Author : Jobin and Jismi IT Services LLP.
 * 
 * Date Created : 30 July 2024
 * 
 * Description : Custom Record with customer record detials and netsuite customer reocrd link.Notification for each each record created either sales rep or NetSuite Admin.
 * REVISION HISTORY 
 * @version  1.0 : : 30 July 2024 : Created the intial build  by  JJ0341 
 * 
 * 
 * 
 **********************************************************************************************/
define([ 'N/email', 'N/log', 'N/record',  'N/search', 'N/ui/serverWidget', 'N/url'],
    
    /**
 *
 * @param{email} email
 * @param{log} log
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 * @param{url} url
 */
    ( email, log, record,  search, serverWidget, url) => {
        'use-strict';
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        /** 
         * Defines the function to create custom record  in NetSuite
         * @param {Object}  subject
         * @param {Object}  recurl
         **/

        function sendEmailNotification(subject, recurl) {
            email.send({
                author: -5,
                body: "Custom Record Created",
                recipients: -5,
                subject: subject + " Link: " + recurl
            });
        }
    /** 
         * Defines the function to create custom record  in NetSuite
         * @param {Object} 
         **/

        function createCustomRecords(customerName,customerEmail,scriptContext,Subject,cusmesage){
            let recordObj;
            recordObj = record.create({
                type: 'customrecord_jj_sl_customer_rec_otp7491',
                isDynamic: true,
            });
            recordObj.setValue({
                fieldId: 'custrecord_jj_sl_cusname_otp7491',
                value: customerName
            });
            recordObj.setValue({
                fieldId:'custrecord_jj_sl_cusaemail_otp7491',
                value:customerEmail
            });
           
            let customerSearch = search.create({
                type: search.Type.CUSTOMER,
                filters: [["email","is",customerEmail]],
                columns: ['internalid','salesrep','email']
            });
            let results = customerSearch.run();
            let customerId;
            let customerNSEmail;
            let salesrep;
            results.each(function(result)
            {
                customerNSEmail  = result.getValue('email');

                customerId = result.getValue({
                    name: "internalid"
                });
                
                salesrep = result.getValue({
                    name: "salesrep",
                });
            });
            if(customerNSEmail === customerEmail){
                let cusurl = url.resolveRecord({
                    recordType: record.Type.CUSTOMER,
                    recordId: customerId,
                    isEditMode: false
                });
                let baseUrl = 'https://system.netsuite.com';
                let urllink = baseUrl + cusurl;
                
                recordObj.setValue({
                    fieldId:"custrecord_jj_sl_cusrecordlink_otp7491",
                    value:urllink
                });
                recordObj.setValue({
                    fieldId: "custrecord_jj_sl_cussubect_otp7491",
                    value: Subject
                });
                recordObj.setValue({
                    fieldId:"custrecord_jj_sl_Message_otp7491",
                    value: cusmesage
                })
                let recid= recordObj.save({
                    ignoreMandatoryFields: true
                });
                let recurl = url.resolveRecord({
                    recordType: 'customrecord_jj_sl_customer_rec_otp7491',
                    recordId: recid,
                    isEditMode: false
                });
                log.debug("salesrep",salesrep);
                if(salesrep){
                    let salesrepObj = search.lookupFields({
                        type: search.Type.EMPLOYEE,
                        id: salesrep,
                        columns:['isinactive']
                        });
                        let inactive = salesrepObj.isinactive;
                        if(salesrep && inactive == true){
                            sendEmailNotification("Custom Record Created To NetSuite Admin",recurl);
                        }
                       else{
                        email.send({
                             author: -5,
                             recipients: salesrep,
                             body: "Custom Record Created To Sales Rep",
                             subject:"Custom Record Detail Created"+urllink, 
                            });
                      
                    }
                    
                }
                else{
                    sendEmailNotification("Custom Record Created To NetSuite Admin",recurl);
                }
               
            let Details = [];
            Details += "<table border='1'>" +
            "<tr><td>Customer Name:</td><td>" + customerName + "</td></tr>" +
            "<tr><td>Email:</td><td>" +customerEmail + "</td></tr>" +
            "<tr><td>Subject:</td><td>" + Subject + "</td></tr>" +
            "<tr><td>Message:</td><td>" + cusmesage + "</td></tr>" +
            "</table><br><br>";
            scriptContext.response.write(Details);
            }
            else{
                recordObj.setValue({
                    fieldId:"custrecord_jj_sl_cusrecordlink_otp7491",
                    value:""
                });
                recordObj.setValue({
                    fieldId: "custrecord_jj_sl_cussubect_otp7491",
                    value: Subject
                });
                recordObj.setValue({
                    fieldId:"custrecord_jj_sl_message_otp7491",
                    value: cusmesage
                });
                let recid;
                recid = recordObj.save({
                    ignoreMandatoryFields: true
                    });
                let recurl = url.resolveRecord({
                    recordType: 'customrecord_jj_sl_customer_rec_otp7491',
                    recordId: recid,
                    isEditMode: false
                });
                let Details = [];
                Details += "<table border='1'>" +
                "<tr><td>Customer Name:</td><td>" + customerName + "</td></tr>" +
                "<tr><td>Email:</td><td>" +customerEmail + "</td></tr>" +
                "<tr><td>Subject:</td><td>" + Subject + "</td></tr>" +
                "<tr><td>Message:</td><td>" + cusmesage + "</td></tr>" +
                "</table><br><br>";
                scriptContext.response.write(Details);
                sendEmailNotification("Custom Record Created To NetSuite Admin",recurl);
            }
        }
 
        const onRequest = (scriptContext) => {
            try
            {
               if(scriptContext.request.method === "GET")
                   {
                           let form =serverWidget.createForm({
                               title: "Customer Record Details"
                       });
                           
                           let fieldGroup = form.addFieldGroup({
                               id: "custpage_primaryInfo",
                               label: "primary Information"
                       });
                           
                           form.addField({
                                id: "custpage_name",
                                label: "Name of the customer",
                                type: serverWidget.FieldType.TEXT,
                                container: "custpage_primaryInfo"
                       }).isMandatory =true;
                           form.addField({
                               id:"custpage_email",
                               label: "Customer Email",
                               type:serverWidget.FieldType.EMAIL,
                               container: "custpage_primaryInfo"
                       }).isMandatory =true;
                           form.addField({
                               id: "custage_subject",
                               label: "Subject",
                               type: serverWidget.FieldType.TEXT,
                               container: "custpage_primaryInfo"
                       });
                           form.addField({
                               id: "custpage_message",
                               label: "Message",
                               type: serverWidget.FieldType.TEXT,
                               container: "custpage_primaryInfo"
                       });
                           form.addSubmitButton({
                               label: "Submit"
                       });
                       
                       scriptContext.response.writePage(form);
   
                   }
                   else
                   {
                       let request = scriptContext.request;
                       let customerName = request.parameters.custpage_name;
                    
                       let customerEmail = request.parameters.custpage_email;
                    
                       let Subject = request.parameters.custage_subject;
                       let cusmesage = request.parameters.custpage_message;
   
                       let Details = [];
                     
                       let customsearchObj = search.create({
                           type: 'customrecord_jj_sl_customer_rec_otp7491',
                           filters: [['custrecord_jj_sl_cusaemail_otp7491','is',customerEmail]],
                           columns: ['internalid']
                       });
                       let resultCount = customsearchObj.run().getRange({
                           start: 0,
                           end: 1000
                       });
                                   
                       if(resultCount < 1)
                        {
                       createCustomRecords(customerName,customerEmail,scriptContext,Subject,cusmesage);
                        } 
                       else{
                            let Details = [];
                            Details += "<table border='1'>" +
                                       "<tr><td>Customer Name:</td><td>" + customerName + "</td></tr>" +
                                       "<tr><td>Email:</td><td>" +customerEmail + "</td></tr>" +
                                       "<tr><td>Subject:</td><td>" + Subject + "</td></tr>" +
                                       "<tr><td>Message:</td><td>" + cusmesage + "</td></tr>" +
                                       "</table><br><br>";
                              scriptContext.response.write("Customer with Same Email Already Exist\n",Details);
                       }
                   }

            }
           catch(e)
           {
               log.error("error",e.message);
           }
        }
        return {onRequest}
    });