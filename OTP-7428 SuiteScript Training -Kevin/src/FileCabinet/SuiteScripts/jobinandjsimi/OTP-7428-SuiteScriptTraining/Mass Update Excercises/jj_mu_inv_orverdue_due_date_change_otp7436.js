/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
        try{
                let today = new Date();
                // let  sevenDaysAgo = new Date();
                // sevenDaysAgo.setDate(today.getDate() - 7);
                let newDate = new Date();
                newDate.setDate(today.getDate() + 14);
                // let seaobj = search.create({
                //     type: search.Type.INVOICE,
                //     filters:[["type","anyof","CustInvc"], 
                //     "AND", 
                //     ["status","anyof","CustInvc:A"],"AND", ['duedate','onorbefore',sevenDaysAgo]
                //     ],
                //     columns: ['tranid','trandate','duedate']
                // });
                // let results = seaobj.run.getRange({
                //     start :0,
                //     end :999
                // });
                // let tranid;
                // let duedate;
                // let trandate;
                //    let ndate;
                recid = record.load({
                    type: record.Type.INVOICE,
                    id: params.id,
                });
                recid.setValue('duedate',newDate);
                recid.save()
    
                // results.each(function(result)
                // {
                //     tranid = result.getValue('tranid');
                //     duedate = result.getValue('duedate');
                //     trandate = result.getValue('trandate');  
                
                //     // ndate = result.getValue('duedate');
                 
                //     return true;
                // });
                
        }catch(e){
            log.error("error details",e.message);
        }
        }

        return {each}

    });
