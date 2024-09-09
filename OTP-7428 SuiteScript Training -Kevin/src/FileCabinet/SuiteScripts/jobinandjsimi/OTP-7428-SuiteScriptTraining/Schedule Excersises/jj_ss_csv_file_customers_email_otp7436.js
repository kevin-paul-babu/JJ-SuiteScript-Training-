/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/log', 'N/record', 'N/runtime', 'N/search','N/file'],
    /**
 * @param{email} email
 * @param{log} log
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (email, log, record, runtime, search, file) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            let objSearch = search.create(
                {
                    type: search.Type.CUSTOMER,
                    filters: [['datecreated','within','lastmonth']],
                    columns: ['internalid','datecreated','salesrep','terms','entityid']
                });
            let csvContent;
            let searchResult = objSearch.run()
            searchResult.each(function(result){
                let customerId = result.getValue('internalid');
                log.debug("Sales Order Id", customerId);
                let customerName = result.getValue('entityid');
                log.debug("Customer Name", customerName);
                let salesRepId = result.getValue('salesrep');
                log.debug("SalesRep Id", salesRepId);
                let salesRepName = result.getText('salesrep');
                log.debug("SalesRep Name", salesRepName);
                let dateCreated = result.getValue('datecreated');
                log.debug("Date Created", dateCreated);
                let terms = result.getValue('terms');
                log.debug("Terms", terms);
                csvContent+= customerId + " " + customerName + " " + salesRepName + " " + dateCreated + " " + terms;
                return true;
            });
        let csvFile = file.create({
          name:'Monthly_Customer_Report.csv',
          fileType:file.Type.CSV,
          contents:csvContent
        });
        csvFile.folder = -15;
        let fieldId = csvFile.save();
        let fileObj = file.load({id:fieldId});
        email.send({
            author:12,
            recipients:-5,
            subject:"Customer Created",
            body:"The report is",
            attachments:[fileObj]

        })

        }

        return {execute}

    });
