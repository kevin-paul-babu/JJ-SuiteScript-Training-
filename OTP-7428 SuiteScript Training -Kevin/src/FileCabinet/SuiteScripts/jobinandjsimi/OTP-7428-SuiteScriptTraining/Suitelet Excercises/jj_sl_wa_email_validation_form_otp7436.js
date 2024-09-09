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
        let details;
        const onRequest = (scriptContext) => {
            
            
                
                if(scriptContext.request.method === 'GET'){
 
                    let form = serverWidget.createForm({
                        title: 'User Information Portal'
                    });
 
                    let fieldGroup = form.addFieldGroup({
                        id: 'custpage_field_group',
                        label: 'Primary Information'
                    })
 
                    form.addField({
                        id: 'custpage_firstname',
                        label: 'First Name',
                        type: serverWidget.FieldType.TEXT,
                        container: 'custpage_field_group'
                    }).isMandatory = true;

                    form.addField({
                        id: 'custpage_lastname',
                        label: 'Last Name',
                        type: serverWidget.FieldType.TEXT,
                        container: 'custpage_field_group'
                    }).isMandatory = true;

                    // form.addField({
                    //     id: 'custpage_dob',
                    //     label: 'Date of Birth',
                    //     type: serverWidget.FieldType.DATE,
                    //     container: 'custpage_field_group'
                    // })
 
                    form.addField({
                        id:'custpage_phone',
                        label: 'Phone',
                        type: serverWidget.FieldType.PHONE,
                        container:'custpage_field_group'
                    }).isMandatory= true;
 
                    form.addField({
                        id:'custpage_email',
                        label:'User Email',
                        type: serverWidget.FieldType.EMAIL,
                        container:'custpage_field_group'
                    });
 
                    form.addField({
                        id:'custpage_salesrep_name',
                        label:"Account Manager",
                        type: serverWidget.FieldType.TEXT,
                        container:'custpage_field_group'
                    });
 
                   
 
                    form.addSubmitButton({
                        label: 'Submit'
                    });
 
                    scriptContext.response.writePage(form)
 
                }
                else{
                    let dob = new Date();
                    let request = scriptContext.request;
                    let firstname =request.parameters.custpage_firstname;
                    let lastname =request.parameters.custpage_lastname;
                     dob = request.parameters.custpage_dob;
                    let phone = request.parameters.custpage_phone;
                    let email = request.parameters.custpage_email;
                   // let accManager = request.parameters.custpage_salesrep_name;
                    

                     details = {
                        firstName:firstname,
                        lastName:lastname,
                        Dob:dob,
                        Phone: phone,
                        Email:email,
                        //AccManager: accManager,
                        
                    }
                   
                    log.debug('Form Data',details);
 
                    scriptContext.response.write('Registration successful!'+'/n'+"Name:"+details.firstName+details.lastName+"/n"+"Dob"+details.Dob+'/n'+
                        "phone:"+details.Phone+'/n'+"email:"+details.Email+'/n'+"Account Manager"+details.AccManager);
                        let salesrep;
                        let vemail = request.parameters.custpage_email;
                        if(vemail){
                            let sobj = search.create({
                                type: search.Type.CUSTOMER,
                                filters: ['email','is',vemail],
                                columns: ['entityid','salesrep']
                            });
                         
                            let results = sobj.run().getRange({
                                start:0,
                                end:10
                            });
                            let cemail;
                           
                            results.forEach(function(result){
                                // .run().each has a limit of 4,000 results
                                cemail = result.getValue('email');
                                log.debug("Email",cemail);
                               salesrep = result.getValue('salesrep');
                               log.debug("Salesrep",salesrep);
                                return true;
                            });
                            
                           
                            
                        }else{
                            alert('Email is invalid');
                        }
                   let recobj = record.create({
                    type:'customrecord_jj_user_details',
                    isDynamic: true,
                  });
                  log.debug("ema");
                   
                  //recobj.setValue( 'name',details.firstName + details.lastName);
              
                  recobj.setValue({
                    fieldId: 'custrecord_firstname',
                    value: details.firstName
                });
                let edob = new Date()

                 recobj.setValue({
                    fieldId: 'custrecord_lastName',
                    value: details.lastName
                });
              
                edob = recobj.setValue({
                    fieldId: 'custrecord_dob',
                    value: details.Dob
                });
                log.debug("dob",dob)
                recobj.setValue({
                    fieldId: 'custrecord_jj_phone',
                    value: details.Phone
                });
              
                recobj.setValue({
                    fieldId: 'custrecord_jj_email',
                    value: details.Email
                });
                
                recobj.setText({
                    fieldId: 'custrecord_accmgr',
                    value:salesrep
                });
 
                let recid = recobj.save({  
                    enableSourcing: true,
                     ignoreMandatoryFields: true});
                log.debug("Record id",recid);
                
                
                }
                
               

               
                
        }

        return {onRequest}

    });
