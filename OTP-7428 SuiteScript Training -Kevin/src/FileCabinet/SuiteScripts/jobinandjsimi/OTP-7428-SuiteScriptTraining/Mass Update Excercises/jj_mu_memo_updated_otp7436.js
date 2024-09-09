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
            type: record.Type.SALES_ORDER,
            id: params.id,
        });
        let memo = "memo updated"
        recid.setValue('memo',memo);
        recid.save();
       }catch(e){
        log.error("error details",e.message)
       }
        }

        return {each}

    });
