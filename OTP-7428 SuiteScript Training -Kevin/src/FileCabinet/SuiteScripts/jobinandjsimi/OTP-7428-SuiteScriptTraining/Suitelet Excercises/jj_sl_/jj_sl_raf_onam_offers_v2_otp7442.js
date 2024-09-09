/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/email', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{email} email
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (email, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{
                if(scriptContext.request.method ==="GET"){
            let form = serverWidget.createForm({
                title:"Sending Onam Offers",
            });
            let fieldGroup  = form.addFieldGroup({
                id: "custpage_filter",
                label: "Filters"
            });
           
        //    form.clientScriptFileId = 2525;

             form.clientScriptModulePath = 'SuiteScripts/jobinandjsimi/OTP-7428-SuiteScriptTraining/Client Script Excersises/jj_cs_raf_onam_offers_v2_otp7442.js';


           let subsidField = form.addField({
                id: "custpage_subsidiary",
                label: "Subsidiary",
                type: serverWidget.FieldType.SELECT,
                source:"subsidiary",
                container:"custpage_filter"
            });
            
            let custField = form.addField({
                id: "custpage_customername",
                label: "CustomerName",
                type: serverWidget.FieldType.SELECT,
                source:"customer",
                container:"custpage_filter"
            });
            

            let subList = form.addSublist({
                id: "custpage_sublist",
                label: "Onam Email to Customers",
                type: serverWidget.SublistType.LIST
            });
            subList.addField({
                id: "custpage_sub_cusid",
                label: "Customer Id",
                type: serverWidget.FieldType.TEXT
            })
            subList.addField({
                id: "custpage_sub_cusname",
                label: "Customer Name",
                type: serverWidget.FieldType.TEXT
            })
            subList.addField({
                id: "custpage_sub_cusemail",
                label: "Customer Email",
                type: serverWidget.FieldType.TEXT,
            });
            subList.addField({
                id: "custpage_sub_invamt",
                label: "Total Invoice Amount",
                type: serverWidget.FieldType.CURRENCY,
            });
            subList.addField({
                id: "custpage_sub_select",
                label: "Select",
                type: serverWidget.FieldType.CHECKBOX
            });

            form.addSubmitButton({
                label: "Send Email"
            })
            let subsidiaryV = scriptContext.request.parameters.subsidiaryValue||'';
            let customerV   = scriptContext.request.parameters.customerValue||'';
            if(subsidiaryV || customerV){
                subsidField.defaultValue = true;
                custField.defaultValue = true;
              let  filter =  [
                    ["datecreated","within","thisyear"], 
                    "AND", 
                    ["amount","greaterthanorequalto","1000.00"], 
                    "AND", 
                    ["currency","anyof","1"],
                    "AND",
                    ["mainline","is","T"]
                 ]
                 if(subsidiaryV){
                    filter.push("AND",["subsidiary","anyof",subsidiaryV])
                 }
                 if(customerV){
                    filter.push("AND",["name","anyof",customerV])
                 }

                let searchObj = search.create({
                    type: search.Type.INVOICE,
                    filters: filter,
                    columns: [
                        search.createColumn({
                        name: "entity",
                        summary: "GROUP",
                        label: "Name"
                     }),
                     search.createColumn({
                        name: "email",
                        join: "customerMain",
                        summary: "GROUP",
                        label: "Email"
                     }),
                     search.createColumn({
                        name: "amount",
                        summary: "SUM",
                        label: "Amount"
                     })]
                });
                let results = searchObj.run().getRange({
                    start:0,
                    end:1000
                });
                for(let i =0;i<results.length;i++){
                
                    subList.setSublistValue({
                        id: 'custpage_sub_cusid',
                        line: i,
                        value: results[i].getValue({
                            name: "entity",
                            summary: "GROUP",
                            label: "Name"
                        })
                    });
                    subList.setSublistValue({
                        id: 'custpage_sub_cusname',
                        line: i,
                        value: results[i].getText({
                            name: "entity",
                            summary: "GROUP",
                            label: "Name"
                        })
                    });
                    subList.setSublistValue({
                        id: 'custpage_sub_cusemail',
                        line: i,
                        value: results[i].getValue({
                            name: "email",
                            join: "customerMain",
                            summary: "GROUP",
                            label: "Email"
                        })
                    });
                    subList.setSublistValue({
                        id: 'custpage_sub_invamt',
                        line: i,
                        value: results[i].getValue({
                            name: "amount",
                            summary: "SUM",
                            label: "Amount"
                        })
                    });
                }
            }
            scriptContext.response.writePage(form);
        }
        else{
            let customerEmail,name;
            let cusid;
            let response;
            let request = scriptContext.request;
            let sublistId = 'custpage_sublist';
            let lineCount = request.getLineCount({
                group: sublistId
            });
            for(let i =0;i<lineCount;i++){
                let select = request.getSublistValue({
                    group: sublistId,
                    line: i,
                    name: "custpage_sub_select"
                });
                log.debug("Select",select);
                if(select === 'T'){
                     cusid = request.getSublistValue({
                        group: sublistId,
                        line: i,
                        name: "custpage_sub_cusid"
                    });
                    name = request.getSublistValue({
                        group: sublistId,
                        line: i,
                        name: "custpage_sub_cusname"
                    });
                    customerEmail = request.getSublistValue({
                        group: sublistId,
                        line: i,
                        name: "custpage_sub_cusemail"
                    });
                    log.debug("email",cusid);
                    if(customerEmail ==="- None -")
                    {
                        response  = "Email is not  send \n";
                    }else{
                        let emailBody =  "Dear "+name+"Hope you are doing fine\n"+"Luckily You are selected for Our Onam Festive Offers Lottery\n"+"Thank You";
                        email.send({
                            author: -5,
                            body: emailBody,
                            recipients: cusid,
                            subject:"Onam Offer Lottery",
                        });
                    response  += "Email is send to "+name+"\n"+emailBody+"\n";
                    }
                }
                
            }
            
            scriptContext.response.write(response);
        }
        }catch(e){
            log.error("error",e.message);
        }

        }

        return {onRequest}

    });
