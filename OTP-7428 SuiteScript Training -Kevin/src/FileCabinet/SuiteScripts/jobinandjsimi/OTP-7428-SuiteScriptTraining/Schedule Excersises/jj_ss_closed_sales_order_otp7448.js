/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/file', 'N/search','N/record'],
    /**
 * @param{email} email
 * @param{file} file
 * @param{search} search
 * @param{record} record
 */
    (email, file, search, record) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
    function ClosedSalesOrderNotif(csvContent,customer){
        try {
            let csvFile = file.create({
                name: "Closed Sales Orders",
                fileType: file.Type.CSV,
                contents: csvContent,
                folder: -5,
                isOnline: true
            })
            let csvFileId = csvFile.save();

            email.send({
                author: -5,
                body: "Dear Customer ,Your sales orders are closed\n"+"Best Regards\nAdministrator",
                recipients:1721,
                subject: "Closed Sales Order Report",
                attachments:[file.load({
                    id:csvFileId
                })]
            })

        } catch (e) {
            log.error("erro",e.message)
        }
        return "email is send to customers"
    }
        const execute = (scriptContext) => {
          try {
                let searchObj = search.create({
                    type: search.Type.SALES_ORDER,
                    filters: [["trandate","onorbefore","thirtydaysago"],"AND",["status","anyof","SalesOrd:B"],"AND",["mainline","is","T"]],
                    columns: ["tranid","internalid","amount","entity"]
                })
                let results = searchObj.run();
               results.each(function(result){
                    let docNo = result.getValue({
                        name: "tranid"
                    });

                    let soid = result.getValue({
                        name: "internalid"
                    })

                    let amount = result.getValue({
                        name: "amount"
                    });

                    let customer = result.getValue({
                        name: "entity"
                    });
                    let customerName = result.getText({
                        name: "entity"
                    });

                    let csvContent = 'Sales OrderId,DocumentNo,Customer Name,Total Amount\n';
                    csvContent += soid+','+docNo+','+customerName+','+amount;
                    log.debug("csv",csvContent);
                    let recordObj = record.load({
                        type: record.Type.SALES_ORDER,
                        id: soid,
                        isDynamic: true
                    });

                    let lineCount = recordObj.getLineCount({
                        sublistId: "item"
                    });
                    log.debug("line count",lineCount);
                for(let i =0; i<lineCount;i++){
                recordObj.selectLine({
                    sublistId: "item",
                    line: i
                });

                recordObj.setCurrentSublistValue({
                    sublistId: "item",
                    fieldId: "isclosed",
                    value: true,
                    line:i,
                    ignoreFieldChange: true
                })

                recordObj.commitLine({
                    sublistId: "item",
                })

                }

                let recid = recordObj.save()
                log.debug("recid",recid);
                if(recid){
                    let result = ClosedSalesOrderNotif(csvContent,customer);
                    log.debug("result",result);
                }
                return true;

                });

                

          } catch (e) {
            log.debug("error",e.message)
          }
        }
        
        return {execute}

    });
