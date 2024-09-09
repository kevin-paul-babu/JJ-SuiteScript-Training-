/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/email', 'N/record', 'N/runtime', 'N/log'],
    /**
 * @param{record} record
 */
    (email, record, runtime, log) => {
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
        const afterSubmit = (context) => {
            let newRecord = context.newRecord;
            let eventType = context.type;
            let currentUser = runtime.getCurrentUser();
            log.debug("user:",currentUser);
            let entityType = newRecord.type;
            let entityId = newRecord.id;
            let entityName = newRecord.getValue('entityid');
            let sender = 16;
            //let emailsender = sender.email;
            
            let recipient = currentUser.email;
            if (eventType === context.UserEventType.CREATE) {
                sendEmail(sender, recipient, 'Record Created', entityType, entityId, entityName, 'created');
            } else if (eventType === context.UserEventType.DELETE) {
                let oldRecord = context.oldRecord;
                entityId = oldRecord.id; // Since newRecord is not available in delete context, use oldRecord
                sendEmail(sender, recipient, 'Record Deleted', entityType, entityId, null, 'deleted');
            }
        }
    
        function sendEmail(sender, recipient, subject, entityType, entityId, entityName, action) {
            let body = 'A record has been ' + action + ':\n\n' +
                       'Entity Type: ' + entityType + '\n' +
                       'Internal ID: ' + entityId + '\n';
    
            if (entityName) {
                body += 'Name: ' + entityName + '\n';
            }
    
            email.send({
                author: sender,
                recipients: recipient,
                subject: subject,
                body: body
            });

            //log.debug("user:",recipient);
        }
    
        return {
            afterSubmit: afterSubmit
        };
    });
        