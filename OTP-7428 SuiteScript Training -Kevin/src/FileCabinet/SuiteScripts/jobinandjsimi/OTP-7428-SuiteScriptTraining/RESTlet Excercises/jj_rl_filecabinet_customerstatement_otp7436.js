/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/currentRecord', 'N/file', 'N/record', 'N/render', 'N/search','N/format'],
    /**
 * @param{currentRecord} currentRecord
 * @param{file} file
 * @param{record} record
 * @param{render} render
 * @param{search} search
 * @param{format} format
 */
    (currentRecord, file, record, render, search, format) => {
       

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {
         try{
            let folderName = requestBody.folder;
            log.debug(folderName);
            let emailID    = requestBody.emailID;
            log.debug('email',emailID);
            let startDatef  = requestBody.startDate;
            log.debug('startDate',startDatef);
            let searchObject = search.create({
                type: search.Type.FOLDER,
                filters: [['name' ,'is',folderName]],
                columns: ['name','internalid']
            });
            let results = searchObject.run().getRange({
                start:0,
                end:1
            });
            let folderN ;
            results.forEach(function(result){
                folderN = result.getValue('name');
            });
            log.debug("NetSuite folder",folderN);

            if(folderN === folderName){
                return "Folder Already exists"
            }
            else{
                let customerSearch = search.create({
                    type:search.Type.CUSTOMER,
                    filters:[['internalidnumber','greaterthan','0']],
                    columns:['internalid']
                });
                let results = customerSearch.run().getRange({
                    start:0,
                    end:1000
                });
                let customerID;

                let newFolder = record.create({
                    type: record.Type.FOLDER,
                    isDynamic: true
                });
                newFolder.setValue({
                    fieldId: "name",
                    value: folderName,
                    ignoreFieldChange:true
                });
               
                let newFolderId = newFolder.save();
                results.forEach(function(result){
                    customerID = result.getValue('internalid');
                    let newFolder = record.create({
                        type: record.Type.FOLDER,
                        isDynamic: true
                    });

                    let date = new Date();
                    log.debug(date);

                    let formattedDate = format.parse({
                        value: date,
                        type: format.Type.INTEGER
                    });
                  
                    log.debug(newFolderId);
                    let customeridInt = format.parse({
                        value: customerID,
                        type: format.Type.INTEGER
                    });
                    let statementFile = render.statement({
                        entityId: customeridInt,
                        printMode: render.PrintMode.PDF,
                        startDate: startDatef
                    });

                     let fileObj = file.create({
                        name: customerID+"_"+date,
                        fileType: file.Type.PDF,
                        contents: statementFile.getContents()
                    });
                    
                    fileObj.folder = newFolderId ;
                    let fileId = fileObj.save();
                    log.debug(fileId);

                   return true;

                })

                return "File Created";

            }
         }catch(e){
            log.error("error",e.message);
         }

        }

    

        return { post}

    });
