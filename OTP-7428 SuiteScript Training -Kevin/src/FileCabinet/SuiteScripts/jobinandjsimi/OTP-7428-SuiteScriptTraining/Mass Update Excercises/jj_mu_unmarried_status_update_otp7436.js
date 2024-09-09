/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
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
                let ostatus = recid.getValue('custrecord_ms');
                log.debug(" old maritial status",ostatus);
                let nstatus = 1;
                let unstatus = 2 ;
                if (ostatus == unstatus){
                    recid.setValue('custrecord_ms',1);
                    let rstatus = recid.getValue('custrecord_ms');
                    log.debug("new maritial status", rstatus);
                    let recordId = recid.save();
                   

                }

            }catch(e){
                log.error("error detais",e.message);
            }
        }

        return {each}

    });
