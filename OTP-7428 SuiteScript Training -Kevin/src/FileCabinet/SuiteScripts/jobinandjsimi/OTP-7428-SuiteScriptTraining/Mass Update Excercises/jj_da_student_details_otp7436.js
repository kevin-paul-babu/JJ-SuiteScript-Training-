/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/record', 'N/runtime'],
    /**
 * @param{record} record
 * @param{runtime} runtime
 */
    (record, runtime) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
            try{
                let recid = record.load({
                    type: params.type,
                    id: params.id,
                  
                });
                //condition1 ?(condition2 ? Expression1 : Expression2) : Expression3;
                let ostatus = recid.getValue('custrecord_jj_wa_sclass_otp743');
                recid.setValue({
                    fieldId: 'name',
                    value: "Student Details"+recid,
                    ignoreFieldChange: true
                });
                // log.debug(" class",ostatus);
                // let nstatus = 1;
                // let unstatus = 2 ;
               
                    recid.setValue({
                        fieldId: 'custrecord_jj_wa_sclass_otp743',
                        value: Number(ostatus)+ 1,
                        ignoreFieldChange: true
                    });
                    log.debug("class", ostatus);
                    recid.save();
    

            }catch(e){
                log.error("error detais",e.message);
            }
        }

        return {each}

    });
