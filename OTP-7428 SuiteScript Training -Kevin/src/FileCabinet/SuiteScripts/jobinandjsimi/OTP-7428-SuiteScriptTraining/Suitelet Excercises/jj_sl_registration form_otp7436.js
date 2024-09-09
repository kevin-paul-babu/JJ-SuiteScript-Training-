/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget','N/record'],
    
    (serverWidget,record) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{
                if(scriptContext.request.method === 'GET'){
 
                    let form = serverWidget.createForm({
                        title: 'Registration Form'
                    });
 
                    let fieldGroup = form.addFieldGroup({
                        id: 'custpage_field_group',
                        label: 'Primary Information'
                    })
 
                    form.addField({
                        id: 'custpage_name',
                        label: 'Name',
                        type: serverWidget.FieldType.TEXT,
                        container: 'custpage_field_group'
                    }).isMandatory = true;
 
                    form.addField({
                        id: 'custpage_age',
                        label: 'Age',
                        type: serverWidget.FieldType.INTEGER,
                        container: 'custpage_field_group'
                    }).isMandatory = true;
 
                    form.addField({
                        id:'custpage_phone',
                        label: 'Phone',
                        type: serverWidget.FieldType.PHONE,
                        container:'custpage_field_group'
                    }).isMandatory= true;
 
                    form.addField({
                        id:'custpage_email',
                        label:'Email',
                        type: serverWidget.FieldType.EMAIL,
                        container:'custpage_field_group'
                    });
 
                    form.addField({
                        id:'custpage_father_name',
                        label:"Father's Name",
                        type: serverWidget.FieldType.TEXT,
                        container:'custpage_field_group'
                    });
 
                    form.addField({
                        id:'custpage_address',
                        label:'Address',
                        type: serverWidget.FieldType.LONGTEXT,
                        container:'custpage_field_group'
                    });
 
                    form.addSubmitButton({
                        label: 'Submit'
                    });
 
                    scriptContext.response.writePage(form)
 
                }
                else{
 
                    let request =scriptContext.request;
                    let name =request.parameters.custpage_name;
                    let age = request.parameters.custpage_age;
                    let phone = request.parameters.custpage_phone;
                    let email = request.parameters.custpage_email;
                    let fatherName = request.parameters.custpage_father_name;
                    let address = request.parameters.custpage_address;

                    let details = {
                        Name: name,
                        Age:age,
                        Phone: phone,
                        Email:email,
                        FatherName:fatherName,
                        Address:address
                    }
                   
                    log.debug('Form Data',details);
 
                    scriptContext.response.write('Registration successful!'+"Name:"+name+"Age:"+age+
                        "phone:"+phone+"email:"+email+"Father'sName"+fatherName+"Address"+address)

                   let recobj = record.create({
                    type:'customrecord_jj_reg_form',
                    isDynamic: true,
                  });
                   
                  recobj.setValue( 'name',details.Name
                );
              
                  recobj.setValue({
                    fieldId: 'custrecord_name',
                    value: details.Name
                });
              
                recobj.setValue({
                    fieldId: 'custrecord_age',
                    value: details.Age
                });
        
                recobj.setValue({
                    fieldId: 'custrecord_phone',
                    value: details.Phone
                });
              
                recobj.setValue({
                    fieldId: 'custrecord_email',
                    value: details.Email
                });
                recobj.setValue({
                    fieldId: 'custrecord_fathername',
                    value: details.FatherName
                });
             
                recobj.setValue({
                    fieldId: 'custrecord_address',
                    value: details.Address
                });
                let recid = recobj.save({  
                    enableSourcing: true,
                     ignoreMandatoryFields: true});
                log.debug("Record id",recid);
                }
            }catch(e){
                log.error("error found ",e.message);
            }
 
        }
        return {onRequest}
    });

