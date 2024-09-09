/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/http'],
    /**
 * @param{serverWidget} serverWidget
 * @param{http} http
 */
    (serverWidget,http) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
         try{
            if(scriptContext.request.method === "GET"){
                let form = serverWidget.createForm({
                    title: "Univeristy List",
                });
                
                form.clientScriptModulePath = 'SuiteScripts/jobinandjsimi/OTP-7428-SuiteScriptTraining/Client Script Excersises/jj_cs_university_list_otp7436.js';

                form.addFieldGroup({
                    id: "custpage_unifilter",
                    label: "University FIlters",
                });
                let countryList = form.addField({
                    id: "custpage_country",
                    label: "Select a Country",
                    type: serverWidget.FieldType.SELECT,
                    container: "custpage_unifilter"
                });
                countryList.addSelectOption({
                    value: "",
                    text:""
                });
                countryList.addSelectOption({
                    value: "India",
                    text:"India"
                });
                countryList.addSelectOption({
                    value: "Japan",
                    text:"Japan"
                });
                countryList.addSelectOption({
                    value: "China",
                    text:"China"
                });
                countryList.isMandatory = true
                let subList = form.addSublist({
                    id:"custpage_sub_univ",
                    label: "University Details",
                    type:serverWidget.SublistType.LIST
                });
                subList.addField({
                    id: "custpage_country",
                    label:"Country",
                    type: serverWidget.FieldType.TEXT
                });
                subList.addField({
                    id: "custpage_univername",
                    label:"University Name",
                    type: serverWidget.FieldType.TEXT
                });
                
                
                subList.addField({
                    id: "custpage_state",
                    label:"State/Province",
                    type: serverWidget.FieldType.TEXT
                });

                subList.addField({
                    id: "custpage_pages",
                    label:"Webpages",
                    type: serverWidget.FieldType.URL
                }).linkText = "Click here";

                // form.addButton({
                //     id: "custpage_submit",
                //     label: "Submit",
                //     functionName: "CountryFieldValue"
                // })
                let countryV = scriptContext.request.parameters.countryValue||'';
                if(countryV){
                    countryList.defaultValue = countryV;
                    let response = http.get({
                    url: "http://universities.hipolabs.com/search?country="+countryV,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                let  universityData ;
                if(response.code == 200){
                    universityData = JSON.parse(response.body);
                    log.debug("data",universityData);
                    for(let i = 0;i<universityData.length;i++){
                        subList.setSublistValue({
                            id: "custpage_country",
                            line: i,
                            value: universityData[i]["country"]
                        });
                        subList.setSublistValue({
                            id: "custpage_state",
                            line: i,
                            value: universityData[i]["state-province"]
                        });
                        subList.setSublistValue({
                            id: "custpage_univername",
                            line: i,
                            value: universityData[i]["name"]
                        });

                        subList.setSublistValue({
                            id: "custpage_pages",
                            line: i,
                            value: universityData[i]["web_pages"]||null
                        });

                    }
                    
                }
            }

                log.debug("Country",countryV);
                scriptContext.response.writePage(form);

            }
         }catch(e){
            log.debug(
              "error",e.message,e.stack)
         }
        }

        return {onRequest}

    });
