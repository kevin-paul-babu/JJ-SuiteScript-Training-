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
 * Author : Kevin Babu 
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
                    });
                        form.addField({
                            id:"custpage_cusemail",
                            label: "Customer Email",
                            type:serverWidget.FieldType.EMAIL,
                            container: "custpage_primaryInfo"
                    });
                        form.addField({
                            id: "custage_cussubject",
                            label: "Subject",
                            type: serverWidget.FieldType.TEXT,
                            container: "custpage_primaryInfo"
                    });
                        form.addField({
                            id: "custpage_cusmessage",
                            label: "Message",
                            type: serverWidget.FieldType.TEXT,
                            container: "custpage_primaryInfo"
                    });
                        form.addSubmitButton({
                            label: "Submit"
                    });
                    
                    scriptContext.response.writePage(form);

                }

                else{
                    let request = scriptContext.request;
                    let cusname = request.parameters.custpage_name;
                    log.debug("name",cusname);
                    let cusemail = request.parameters.custpage_cusemail;
                    let cussubject = request.parameters.custage_cussubject;
                    let cusmesage = request.parameters.custpage_cusmessage;

                    let Details = [];
                    log.debug("email:",cusemail);
                    let recordObj = record.create({
                        type: 'customrecord_jj_sl_customer_rec_otp7491',
                        isDynamic: true,
                    })

                    recordObj.setValue({
                        fieldId: 'custrecord_jj_sl_cusname_otp7491',
                        value: cusname
                    })
                     
                    recordObj.setValue({
                        fieldId:'custrecord_jj_sl_cusaemail_otp7491',
                        value:cusemail
                    });
                    // log.debug("email",cusemail);
                    let customerSearch = search.create({
                        type: search.Type.CUSTOMER,
                        filters: [["email","is",cusemail]],
                        columns: ['internalid','salesrep','email']
                    });
                    let results = customerSearch.run();
                    let cusid;
                    let salesrep;
                    let Cusemail;
                    results.each(function(result)
                    {
                        Cusemail  = result.getValue({
                            name:"email"
                        });
                        cusid = result.getValue({
                            name: "internalid"
                        });
                        salesrep = result.getValue({
                            name: "salesrep",
                        });
                    });
                    if(Cusemail !== cusemail)
                        {
                            log.debug("customer record not found in NetSuite");
                            
                            recordObj.setValue({
                                fieldId:"custrecord_jj_sl_cusrecordlink_otp7491",
                                value:""
                            });

                            recordObj.setValue({
                                fieldId: "custrecord_jj_sl_cussubect_otp7491",
                                value: cussubject
                            });
                            recordObj.setValue({
                                fieldId:"custrecord_jj_sl_cusmessage_otp7491",
                                value: cusmesage
                            });
                            let recid = recordObj.save({
                                ignoreMandatoryFields: true
                            });
                            let recurl = url.resolveRecord({
                                recordType: 'customrecord_jj_sl_customer_rec_otp7491',
                                recordId: recid,
                                isEditMode: false
                            });
                            Details += "<table border='1'>" +
                            "<tr><td>Customer Name:</td><td>" + cusname + "</td></tr>" +
                            "<tr><td>Email:</td><td>" +cusemail + "</td></tr>" +
                            "<tr><td>Subject:</td><td>" + cussubject + "</td></tr>" +
                            "<tr><td>Message:</td><td>" + cusmesage + "</td></tr>" +
                            "</table><br><br>";
                            scriptContext.response.write(Details);
                            email.send({
                                author: -5,
                                body: "Custom Record Created",
                                recipients: -5,
                                subject:"Customer Record Created Link: "+recurl, 
                            });
                        }
                        else
                        {
                            log.debug("salesrep",salesrep);

                            let cusurl = url.resolveRecord({
                                recordType: record.Type.CUSTOMER,
                                recordId: cusid,
                                isEditMode: false
                            });
                            let baseUrl = 'https://system.netsuite.com';
                            let urllink = baseUrl + cusurl;
                            log.debug('URL', urllink);
                            //    let recordlink = '<a href='+urllink+'>'+cusname+'</a>';
                            //    log.debug(recordlink);
                            //
                            // let LinkField = recordObj.getField('custrecord_jj_sl_cusrecordlink_otp7491');
                            // LinkField.setlinkText
                            // let linkObj = '<a href="'+urllink+'">Click here.</a>';

                            recordObj.setValue({
                                fieldId:"custrecord_jj_sl_cusrecordlink_otp7491",
                                value:urllink
                            });
                            recordObj.setValue({
                                fieldId: "custrecord_jj_sl_cussubect_otp7491",
                                value: cussubject
                            });
                            recordObj.setValue({
                                fieldId:"custrecord_jj_sl_cusmessage_otp7491",
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
                            if(salesrep)
                                {
                                    email.send({
                                        author: -5,
                                        recipients: salesrep,
                                        body: "Custom Record Created",
                                        subject:"Custom Record Detail Created"+urllink, 
                                    });
                                }
                                else
                                {
                                    email.send({
                                        author: -5,
                                        body: "Custom Record Created",
                                        recipients: -5,
                                        subject:"Customer Record Created Link: "+recurl, 
                                    });
                                }
                                Details += "<table border='1'>" +
                                 "<tr><td>Customer Name:</td><td>" + cusname + "</td></tr>" +
                                 "<tr><td>Email:</td><td>" +cusemail + "</td></tr>" +
                                 "<tr><td>Subject:</td><td>" + cussubject + "</td></tr>" +
                                 "<tr><td>Message:</td><td>" + cusmesage + "</td></tr>" +
                                 "</table><br><br>";
                                 scriptContext.response.write(Details);
                        }
                    }
            }
            catch(e)
            {
                log.error("error",e.message+e.stack);
            }
        }
        return {onRequest}
    });
