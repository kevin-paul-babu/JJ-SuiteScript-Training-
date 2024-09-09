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
                    ['trandate', 'within', 'lastmonth']
                ],
                columns: [
                    'internalid', 'tranid', 'entity', 'salesrep'
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
            let emailBody;
            // Group sales orders by sales rep
            salesOrderResults.forEach(function(result) {
                 salesRepId = result.getValue('salesrep');
                if (!salesOrdersByRep[salesRepId]) {
                    salesOrdersByRep[salesRepId] = [];
                }
                salesOrdersByRep[salesRepId].push({
                    id: result.getValue('internalid'),
                    tranid: result.getValue('tranid')
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

                 emailBody = 'Sales orders for sales rep: ' + salesRep.getValue('firstname') + ' ' + salesRep.getValue('lastname') + '\n\n';
                salesOrdersByRep[salesRepId].forEach(function(order) {
                    emailBody += 'Order ID: ' + order.id + ', Transaction ID: ' + order.tranid + '\n';
                });

                email.send({
                    author: salesRepId,
                    recipients:managerId,
                    subject: 'Sales Orders Summary',
                    body: emailBody
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