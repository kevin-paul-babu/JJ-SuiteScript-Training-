/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/render', 'N/search', 'N/url','N/file'],
    /**
 * @param{render} render
 * @param{search} search
 * @param{url} url
 * @param{file} file
 */
    (render, search, url,file) => {
      

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
                let docname = requestBody.recordname;
                let docid   = requestBody.docid;
                log.debug(docname);
                let searchObj =  search.create({
                    type: search.Type.INVOICE,
                    filters: ['tranid','anyof',docid],
                    columns:['internalid']
                });
                let results = searchObj.run().getRange({
                    start:0,
                    end:1
                });
                let invId=0;
                results.forEach(function(result){
                    invId = result.getValue('internalid');
                    log.debug(invId);
                });
                let pdfId = render.transaction({
                    entityId: Number(invId),
                    printMode:render.PrintMode.PDF
                });

                log.debug(pdfId); 
                let fileObj = file.create({
                    name: docname,
                    fileType: file.Type.PDF,
                    contents: pdfId.getContents()
                });
                fileObj.folder =-15 ;
                fileObj.isOnline =true;
                let fileId = fileObj.save();
                let fileName = file.load({
                    id: fileId
                });
                //fileName.url;
                log
                log.debug("url",fileName.url);
                log.debug("path",fileName.path);
                let baseUrl = "https://td2933147.app.netsuite.com/"
                return {
                    "docname":docname,
                    "document No":docid,
                    "url":baseUrl+fileName.url
                }

           }
           catch(e){
            log.error("error",e.message)
           }





        }

    
    

        return {post}

    });
