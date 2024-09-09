/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/record', 'N/search', 'N/ui/serverWidget', 'N/format'],
    /**
     * @param{log} log
     * @param{record} record
     * @param{search} search
     * @param{serverWidget} serverWidget
     * @param{format} format
     */
    (log, record, search, serverWidget, format) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                let form = serverWidget.createForm({
                    title: "Eligible Blood Donors"
                });

                let bloodgrp = form.addField({
                    id: "custpage_bloodgrp",
                    label: "Blood Group",
                    type: serverWidget.FieldType.SELECT,
                });

                bloodgrp.addSelectOption({ value: "", text: "" });
                bloodgrp.addSelectOption({ value: 1, text: "A+ve" });
                bloodgrp.addSelectOption({ value: 2, text: "B+ve" });
                bloodgrp.addSelectOption({ value: 3, text: "A-ve" });
                bloodgrp.addSelectOption({ value: 4, text: "B-ve" });
                bloodgrp.addSelectOption({ value: 5, text: "AB+ve" });
                bloodgrp.addSelectOption({ value: 6, text: "AB-ve" });
                bloodgrp.addSelectOption({ value: 7, text: "O-ve" });
                bloodgrp.addSelectOption({ value: 8, text: "O+ve" });

                form.addField({
                    id: "custpage_last_donation",
                    label: "Last Donation Days",
                    type: serverWidget.FieldType.DATE
                });

                form.addSubmitButton({
                    label: 'Submit'
                });

                scriptContext.response.writePage(form);
            } else 
            {
                let BloodGroup = scriptContext.request.parameters.custpage_bloodgrp;
                let lastDate = scriptContext.request.parameters.custpage_last_donation;

                let formatlastDate = format.parse({
                    value:lastDate,
                    type: format.Type.DATE
                });

                let Details = "";
                let objSearch = search.create({
                    type: 'customrecord_jj_sl_bld_don_det_otp7436',
                    filters: ['custrecord_jj_bd_lstdon_date_otp7436', 'onorbefore', 'threemonthsago'],
                    columns: ['custrecord_jj_bd_fn_otp7436', 'custrecord_jj_bd_ln_otp7436', 'custrecord_jj_bd_phone_num_otp7436', 'custrecord_jj_bd_blood_grp_otp7436','custrecord_jj_bd_lstdon_date_otp7436']
                });

                let results = objSearch.run();
                results.each(function (result) {
                    let fname = result.getValue({ name: 'custrecord_jj_bd_fn_otp7436' });
                    let lname = result.getValue({ name: 'custrecord_jj_bd_ln_otp7436' });
                    let phone = result.getValue({ name: 'custrecord_jj_bd_phone_num_otp7436' });
                    let blood = result.getValue({ name: 'custrecord_jj_bd_blood_grp_otp7436' });
                    let date  = result.getValue({name:'custrecord_jj_bd_lstdon_date_otp7436'});

                    if (blood === BloodGroup) {
                        Details += "<table border='1'>" +
                            "<tr><td>First Name:</td><td>" + fname + "</td></tr>" +
                            "<tr><td>Last Name:</td><td>" + lname + "</td></tr>" +
                            "<tr><td>Blood Group:</td><td>" + BloodGroup + "</td></tr>" +
                            "<tr><td>Phone Number:</td><td>" + phone + "</td></tr>" +
                            "<tr><td>Last Donation Date:</td><td>" + date + "</td></tr>" +
                            "</table><br><br>";
                    }

                    return true;                 });

                scriptContext.response.write(Details);
            }
        }

        return { onRequest }
    });
