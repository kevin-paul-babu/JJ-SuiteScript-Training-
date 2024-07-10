/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/search'], function(record, search) {

    function execute(context) {
        // Define a search to get all customer records
        var customerSearch = search.create({
            type: search.Type.CUSTOMER,
            filters: [],
            columns: ['internalid', '', 'datecreated']
        });

        // Execute the search and process each result
        customerSearch.run().each(function(result) 
        {
            var customerId = result.getValue('internalid');
            var customerName = result.getText('companyname');
            var dateCreated = result.getValue('datecreated');
            var monthCreated = ('0' + (new Date(dateCreated).getMonth() + 1)).slice(-2);
            
            // Create the short name
            var shortName = customerName.substring(0, 2) + ': ' + monthCreated;

            // Load the customer record and update the short name field
            var customerRecord = record.load({
                type: record.Type.CUSTOMER,
                id: customerId,
                isDynamic: false
            });

            customerRecord.setValue({
                fieldId: 'custentity_short_name',
                value: shortName
            });

            customerRecord.save({
                enableSourcing: false,
                ignoreMandatoryFields: true
            });

            return true; // Continue to the next result
        });
    }

    return {
        execute: execute
    };
});
