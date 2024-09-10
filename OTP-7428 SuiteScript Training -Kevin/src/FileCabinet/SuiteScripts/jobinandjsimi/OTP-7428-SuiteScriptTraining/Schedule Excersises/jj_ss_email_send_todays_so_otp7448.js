/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/search'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{search} search
 */
    (email, record, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        function CreateSearch (){
            try {
                let searchObj = search.create({
                    type: search.Type.SALES_ORDER,
                    filters:[ ["trandate","within","twodaysago"], 
                    "AND", 
                    ["mainline","is","T"]],
                    columns:['internalid','tranid','entity','trandate','amount','salesrep']
                   }) 
                let results = searchObj.run().getRange({
                    start: 0,
                    end: 1000
                });
                log.debug("results0",results)
                return results;
                   
            } catch (e) {
                log.error("error",e.message);
            }
        }
        function sendEmailtoSalesRep(supervisor,table,salesRep,date){
       try {
        let dateL = new Date();
        let day = dateL.getDate();
        let month = dateL.getMonth() + 1;
        let year = dateL.getFullYear();
        let currentDate = `${day}-${month}-${year}`; // "17-6-2022"
        email.send({
            author: supervisor,
            body: table,
            recipients:salesRep,
            subject: "Kindly review your"+date+" sales order"
        })
       } catch (e) {
        log.error("error",e.message);
    }
        }
        const execute = (scriptContext) => {
            try {
                let table ='';
                let salesRep; 
                let text;
                let results = CreateSearch();
                log.debug("results",results)
                for(let i =0;i<results.length;i++){
                   
                let  docNo = results[i].getValue({
                    name: "tranid"
                });
                let  customer = results[i].getText({
                    name: "entity"
                });
                let date  = results[i].getValue({
                    name :"trandate"                
                });
                let amount = results[i].getValue({
                    name: "amount"
                });
                let internalid = results[i].getValue({
                    name: "internalid"
                });
                table ="<table><tr><th>Document Number</th><th>Customer</th><th>Date</th><th>Amount</th></tr>"+
                "<tr><td>"+"<a href = https://td2931940.app.netsuite.com/app/accounting/transactions/salesord.nl?id="+internalid+">"+docNo+"</a></td><td>"+customer+"</td><td>"+date+"</td><td>"+amount+"</td></tr>"
                +"</table><br><br>";

                // log.debug("table",table);
                salesRep = results[i].getValue({
                    name: "salesrep"
                });
                log.debug("salesrep",salesRep);
                let lookupObj = search.lookupFields({
                    type: search.Type.EMPLOYEE,
                    id: salesRep,
                    columns: ['supervisor','email']
                })
                let supervisor = lookupObj.supervisor.value||-5;
                log.debug("supervisor",supervisor);
                let email      = lookupObj.email||'';
                log.debug("supervisor email",email);
                let result = sendEmailtoSalesRep(supervisor,table,salesRep,date);
                text = "Email is send";
                log.debug("Email is send",text);
                }
            } catch (e) {
                log.error("error",e.message);
            }
        }

        return {execute}

    });
