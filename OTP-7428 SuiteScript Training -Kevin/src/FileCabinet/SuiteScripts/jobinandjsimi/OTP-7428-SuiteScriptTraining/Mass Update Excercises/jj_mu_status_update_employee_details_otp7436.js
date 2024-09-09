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
            
            let recordobj = record.load({
              type: params.type,
              id: params.id
            
          });
        let status = recordobj.getValue('custrecord_employee_status');
        log.debug("stratus",status);
       let m = "Active";
       let n = "Inactive";
        let vacdays = recordobj.getValue('custrecord_employee_vacdays');
        log.debug("vdays",vacdays);
        
        let probdays = recordobj.getValue('custrecord_employee_probdays');
        log.debug("pdays",probdays);
       
           if(status === m){
            if(vacdays > 60)
              {
              let memo = "On Leave";
              recordobj.setValue(
                'custrecord_employee_status',memo);
                recordobj.save();
           }
          
}
              
         else if(status === n){
          if(probdays >90){

            let memo = "Terminated";
               recordobj.setText(
                    'custrecord_employee_status',memo);
                    recordobj.save();
            }
         }
         
    else{
       log.debug("eroor");
    }}catch(e){
            log.error("error",e.message);
          }
        }

        return {each}

    });
