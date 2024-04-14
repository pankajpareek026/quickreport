class ApiRespose {
    constructor(success = true, message = 'success', data = null, redirectUrl = null) {
        this.success = success;
        this.message = message;
        this.redirectUrl = redirectUrl;
        this.data = data;
        this.error = false;

    }

}

export { ApiRespose }