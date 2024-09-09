/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/search', 'N/runtime'], function(email, record, search, runtime) {
    function execute(context) {
        try {
            // Define the sales order search
            let salesOrderSearch = search.create({
                type: search.Type.SALES_ORDER,
                filters: [
                    // Add necessary filters here, for example, orders created in the last 7 days
                    ['trandate', 'within', 'today'],"AND",['mainline','is','T']
                ],
                columns: [
                    'internalid', 'tranid', 'entity', 'salesrep','trandate','datecreated','total'
                ]
            });

            // Run the search and process each result
            let salesOrderResults = salesOrderSearch.run().getRange({
                start: 0,
                end: 1000 // Adjust this as needed
            });

            let salesOrdersByRep = {};
            let salesRepId;
            let salesRep;
            let managerId;
            let managerEmail;
            
            // Group sales orders by sales rep
            salesOrderResults.forEach(function(result) {
                 salesRepId = result.getValue('salesrep');
                if (!salesOrdersByRep[salesRepId]) {
                    salesOrdersByRep[salesRepId] = [];
                }
                salesOrdersByRep[salesRepId].push({
                    id: result.getValue('internalid'),
                    tranid: result.getValue('tranid'),
                    entity:result.getValue('entity'),
                    sodate:result.getValue('createddate'),
                    date: result.getValue('trandate'),
                    total:result.getValue('total')
                });
            });
 
            // For each sales rep, find their manager and send an email
            for ( let salesRepId in salesOrdersByRep) {
                 salesRep = record.load({
                    type: record.Type.EMPLOYEE,
                    id: salesRepId
                });

                 managerId = salesRep.getValue('supervisor');
                 managerEmail = salesRep.getValue('email');
 if(managerId === null){
    managerId = -5;
 }   
 let emailBody = 'Order ID: , Transaction ID: , Customer:, Sales Order Date, Created Date \n';

                             
                salesOrdersByRep[salesRepId].forEach(function(salesOrdersByRep) {
 emailBody += 'Order ID: ' + salesOrdersByRep.id + ', Transaction ID: ' + salesOrdersByRep.tranid +', Customer: '+ '\n'+salesOrdersByRep.entity+', Sales Order Date: '+'\n'+salesOrdersByRep.sodate+ ', Created Date: '+'\n'+salesOrdersByRep.date ;
  
 email.send({
    author: salesRepId,
    recipients:managerId,
    subject: 'Kindly review your sales order'+salesOrdersByRep.date,
    body : emailBody
//     body: <pre>     <html>
//     <table id="mytable">
//    <thead>   <tr>
   
//    <th scope="col">Document No</th>
//    <th scope="col">Customer Name</th>
//    <th scope="col">Date</th>
//    <th scope="col">Amount</th>
   
//    </tr></thead>
//    <tbody>
//    </tbody>  
//    <tr>
//    <th scope="row"><a >salesOrdersByRep.tranid</a></th>
//    <td>salesOrdersByRep.entity</td>
//    <td>salesOrdersByRep.sodate</td>
//    <td>salesOrdersByRep.total</td>
//    </tr>
//    </table>
//    </html>
//    </pre>
                 
});

                });

            }
        } catch (e) {
            log.error({
                title: 'Error executing script',
                details: e
            });
        }
    }

    return {
        execute: execute
    };
});

