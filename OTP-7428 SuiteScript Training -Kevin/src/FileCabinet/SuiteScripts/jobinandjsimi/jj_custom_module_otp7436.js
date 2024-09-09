/**
 * @NApiVersion 2.1
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {

        function AddNumbers(num1,num2) {
            return num1 + num2 ;
        }

        return {AddNumbers}

    });
