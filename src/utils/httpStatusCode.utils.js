// to amanage all status codes
const statusCode = {
    ok: 200, //success
    created: 201, //is resource created successfully , this is basically for save something in database
    noContent: 204, // when there is no content to send
    badRequest: 400, //in case of invalid parameters or invalid query which server can't understand
    unauthorized: 401,// in case of unauthorized request 
    forbidden: 403,// client does not have permission to access the requested resource.
    notFound: 404,//not found
    internalServerError: 500, // in case of internal server error
    serviceUnavailable: 503,//The server is currently unable to handle the request due to temporary overloading or maintenance of the server

}

export { statusCode }