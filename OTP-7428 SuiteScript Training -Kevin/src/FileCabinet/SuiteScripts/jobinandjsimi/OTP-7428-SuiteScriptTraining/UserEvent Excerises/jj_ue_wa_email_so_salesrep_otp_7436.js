/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log', 'N/record', 'N/search','N/email','N/runtime'],
    /**
 * @param{log} log
 * @param{record} record
 * @param{search} search
 */
    (log, record, search, email,runtime) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
           try{
                        recid = scriptContext.newRecord;
                        let cusid = recid.getValue({fieldId:'entity'});
                        log.debug("cusid",cusid);
                        let cusname = recid.getText({fieldId:'entity'});
                        let salesrep = recid.getValue({fieldId:'salesrep'});
                        log.debug("slaesrep",salesrep);
                        let rrobj = search.lookupFields({
                            type: search.Type.EMPLOYEE,
                            id: salesrep,
                            columns:['email']
                        });
                        let emailsr = rrobj.email ;
                        log.debug("email",emailsr)
                        let ssoobj = search.create({
                            type: "salesorder",
                            settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
                            filters:
                            [
                            ["type","anyof","SalesOrd"], 
                            "AND", 
                            ["status","noneof","SalesOrd:C","SalesOrd:H","SalesOrd:G"], 
                            "AND", 
                            ["mainline","is","T"]
                            ],
                            columns:
                            [
                            search.createColumn({
                                name: "entity",
                                summary: "GROUP",
                                label: "Name"
                            }),
                            search.createColumn({
                                name: "statusref",
                                summary: "GROUP",
                                label: "Status"
                            }),
                            search.createColumn({
                                name: "tranid",
                                summary: "COUNT",
                                label: "Document Number"
                            })
                            ]
                        });
                        
                        let results = ssoobj.run().getRange({
                            start: 0,
                            end:100
                        });
                        let docno;
                        results.forEach(function(result){
                            // .run().each has a limit of 4,000 results
                             docno = result.getValue(ssoobj.columns[2]);
                            let name  = result.getText(ssoobj.columns[0]);
                            log.debug("name"+name+"docno:"+docno)


                            return true;
                        });
                        let message = "The customer"+cusname+"has more than 5 open sales orders";
                        if(docno > 5){
                        //let sender = -5;
                            
                            let currentUser = runtime.getCurrentUser();
                            let currid = currentUser.id;
                            email.send({
                               author: currid,
                               body:message,
                               recipients: emailsr,
                               subject:"The customer is overdue in his/her transactions"
                            })
                        }
                        

           }catch(e){
            log.error("error details",e.message)
           }
        }

        return {afterSubmit}

    });
