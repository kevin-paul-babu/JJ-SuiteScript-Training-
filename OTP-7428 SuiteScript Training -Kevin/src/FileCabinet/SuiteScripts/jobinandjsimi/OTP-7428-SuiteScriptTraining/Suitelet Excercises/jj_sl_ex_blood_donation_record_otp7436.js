/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{serverWidget} serverWidget
 */
    (record, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
try{
            if(scriptContext.request.method === 'GET')
        {
                let form = serverWidget.createForm({
                    title: "Blood Donation Detials"
                });
                let fieldGroup = form.addFieldGroup({
                    id: 'custpage_field_group',
                    label: "Primary Informaion",
                });
            form.addField({
                id: "custpage_firstname",
                label: 'First Name',
                type: serverWidget.FieldType.TEXT,
                container: 'custpage_field_group'
            });
            
            form.addField({
                id: "custpage_lastname",
                label: 'Last Name',
                type: serverWidget.FieldType.TEXT,
                container: 'custpage_field_group'
            });
            let gender = form.addField({
                id: "custpage_gender",
                label: 'Gender',
                type: serverWidget.FieldType.SELECT,
                container: 'custpage_field_group'
            });
            gender.addSelectOption({
                value:"",
                text: "",
            
            });

            gender.addSelectOption({
                value:1,
                text: "Male",
            
            });

            gender.addSelectOption({
                value:2,
                text: "Female",
            
            });
            gender.addSelectOption({
                value:3,
                text: "Other",
            
            });


            let bloodgrp = form.addField({
                id: "custpage_blood_group",
                label: 'Blood Group',
                type: serverWidget.FieldType.SELECT,
                container: 'custpage_field_group'
            });
            bloodgrp.addSelectOption({
                value:"",
                text: "",
            
            });

            bloodgrp.addSelectOption({
                value:1,
                text: "A+ve",
            
            });

            bloodgrp.addSelectOption({
                value:2,
                text: "B+ve",
            
            });
            
            bloodgrp.addSelectOption({
                value:8,
                text: "O+ve",
            
            });

            bloodgrp.addSelectOption({
                value:3,
                text: "A-ve",
            
            });

            bloodgrp.addSelectOption({
                value:4,
                text: "B-ve",
            
            });
            
            bloodgrp.addSelectOption({
                value:7,
                text: "O-ve",
            
            });

            bloodgrp.addSelectOption({
                value:5,
                text: "AB+ve",
            
            });

            bloodgrp.addSelectOption({
                value:6,
                text: "AB-ve",
            
            });



            form.addField({
                id: "custpage_phone",
                label: 'Phone',
                type: serverWidget.FieldType.PHONE,
                container: 'custpage_field_group'
            });
            form.addField({
                id: "custpage_last_donation_days",
                label: 'Last Donation Days',
                type: serverWidget.FieldType.DATE,
                container: 'custpage_field_group'
            });

            form.addSubmitButton({
                label: 'Submit'
            });

            scriptContext.response.writePage(form);
        }
   
        else{
                let request = scriptContext.request;
                let fname = request.parameters.custpage_firstname;
                let lname = request.parameters.custpage_lastname;
                let gender= request.parameters.custpage_gender;
                let bloodgrp = request.parameters.custpage_blood_group;
                let phone = request.parameters.custpage_phone;
                let ldonday = request.parameters.custpage_last_donation_days;
                
                let recobj = record.create({
                    type:'customrecord_jj_sl_bld_don_det_otp7436',
                    isDynamic: true,
                });

                recobj.setValue({
                    fieldId: 'custrecord_jj_bd_fn_otp7436',
                    value:fname
                });
                recobj.setValue({
                    fieldId: 'custrecord_jj_bd_ln_otp7436',
                    value:lname
                });

                recobj.setValue({
                    fieldId: 'custrecord_jj_bd_gen_otp7436',
                    value:gender
                });

                recobj.setValue({
                    fieldId: 'custrecord_jj_bd_phone_num_otp7436',
                    value:phone
                });
                
                recobj.setValue({
                    fieldId: 'custrecord_jj_bd_phone_num_otp7436',
                    value:phone
                });

                
                recobj.setValue({
                    fieldId: 'custrecord_jj_bd_blood_grp_otp7436',
                    value:bloodgrp
                });
                
                
                recobj.setValue({
                    fieldId: 'custrecord_jj_bd_lstdon_date_otp7436',
                    value:new Date(ldonday)
                });
                
                let recid = recobj.save({  
                    enableSourcing: true,
                    ignoreMandatoryFields: true});
                log.debug("Record id",recid);
                scriptContext.response.write(
                    '<table border="1">' +
                        '<tr><th>Field</th><th>Blood Donation Form Details</th></tr>' +
                        '<tr><td>First Name</td><td>' + fname + '</td></tr>' +
                        '<tr><td>Last Name</td><td>' + lname + '</td></tr>' +
                        '<tr><td>Gender</td><td>' + gender + '</td></tr>' +
                        '<tr><td>Blood Group</td><td>' + bloodgrp + '</td></tr>' +
                        '<tr><td>Phone</td><td>' + phone + '</td></tr>' +
                        '<tr><td>Last Donation Day</td><td>' + ldonday + '</td></tr>' +
                    '</table>'
                );
                }
   }
   catch(e)
   {
    log.error("error",e.message);
   }

    }
        return {onRequest}

    });
