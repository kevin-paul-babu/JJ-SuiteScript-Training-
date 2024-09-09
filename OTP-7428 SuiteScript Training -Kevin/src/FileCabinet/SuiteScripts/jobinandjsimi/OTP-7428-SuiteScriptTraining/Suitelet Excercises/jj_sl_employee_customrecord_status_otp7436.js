/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/currentRecord', 'N/log', 'N/record', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{currentRecord} currentRecord
 * @param{log} log
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (currentRecord, log, record, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
      try{     if(scriptContext.request.method==='GET'){
        let form = serverWidget.createForm({
            title: "Employee Details"
        });
        let fieldGroup = form.addFieldGroup({
            id: 'custpage_field_group',
            label: "Primary Informaion",
        });
       form.addField({
        id: "custpage_employeename",
        label: 'Name of the Employee',
        type: serverWidget.FieldType.TEXT,
        container: 'custpage_field_group'
       });
       
       form.addField({
        id: "custpage_employee_dept",
        label: 'Department',
        type: serverWidget.FieldType.TEXT,
        container: 'custpage_field_group'
       });

       form.addField({
        id: "custpage_employee_status",
        label: 'Status',
        type: serverWidget.FieldType.TEXT,
        container: 'custpage_field_group'
       });

       form.addField({
        id: "custpage_employee_vacdays",
        label: 'Vacation days',
        type: serverWidget.FieldType.INTEGER,
        container: 'custpage_field_group'
       });
       form.addField({
        id: "custpage_employee_probdays",
        label: 'Probation period days',
        type: serverWidget.FieldType.INTEGER,
        container: 'custpage_field_group'
       });

       form.addSubmitButton({
        label: 'Submit'
       });

       scriptContext.response.writePage(form);

       
       }

       else{
        let request = scriptContext.request;
                let employeename =request.parameters.custpage_employeename;
                let department =request.parameters.custpage_employee_dept;
                let vacdays =request.parameters.custpage_employee_vacdays;
                let status =request.parameters.custpage_employee_status;
                let probdays = request.parameters.custpage_employee_probdays;

                scriptContext.response.write('Registration successful!'+'/n'+"Name:"+employeename+"/n"+"Department"+ department+'/n'+
                    "status"+status+'/n'+"vacationdays"+vacdays+'/n'+"Probationary"+probdays );
                    let recobj = record.create({
                        type:'customrecord_jj_employee_details',
                        isDynamic: true,
                      });

                      recobj.setValue({
                        fieldId: 'custrecord_employeename',
                        value:employeename
                    });
                    recobj.setValue({
                        fieldId: 'custrecord_employee_dept',
                        value:department
                    });

                    recobj.setValue({
                        fieldId: 'custrecord_employee_status',
                        value:status
                    });

                    recobj.setValue({
                        fieldId: 'custrecord_employee_vacdays',
                        value:vacdays

                    });

                    
                    recobj.setValue({
                        fieldId: 'custrecord_employee_probdays',
                        value:probdays
                        
                    });

                    let recid = recobj.save({  
                        enableSourcing: true,
                         ignoreMandatoryFields: true});
                    log.debug("Record id",recid);
                     
                 
       }    
}catch(e){
        log.error("error",e.message)
      }
        }



        return {onRequest}

    });
