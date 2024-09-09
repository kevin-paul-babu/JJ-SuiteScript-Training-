/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/redirect'], function(record, redirect) {

    function onAction(scriptContext) {
        try {
            var taskRecord = scriptContext.newRecord;

            // Create the custom record
            var customRecord = record.create({
                type: 'customrecord_custom_test_record' // replace with your custom record ID
            });

            // Set values for custom record fields
            customRecord.setValue({
                fieldId: 'name',
                value: 'Custom Record Name'
            });

            customRecord.setValue({
                fieldId: 'custrecord_test_field', // replace with your custom field ID
                value: 'Test Field Value'
            });

            // Save the custom record
            var customRecordId = customRecord.save();

            // Set the custom record ID in the task record's custom field
            taskRecord.setValue({
                fieldId: 'custbody_custom_record_id', // replace with your custom field ID
                value: customRecordId
            });

            // Redirect to the custom record
            redirect.toRecord({
                type: 'customrecord_custom_test_record', // replace with your custom record ID
                id: customRecordId
            });

        } catch (e) {
            log.error('Error creating and redirecting to custom record', e);
        }
    }

    return {
        onAction: onAction
    };
});
