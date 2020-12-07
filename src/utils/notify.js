const axios = require('axios');
const qs = require('qs');
const webhookUrl = process.env.WEBHOOK_URL || null;

module.exports = class Notify {
    static _post(body) {
        if (webhookUrl) {
            return axios.post(webhookUrl, body).catch((error) => {
                console.error(error);
            });
        } else {
            throw new Error("You must define the WEBHOOK_URL environment variable.");
        }
    }

    static requestSuccess(request, results, processingTime) {
        return Notify._post({
            request: request,
            results: results,
            processingTime: processingTime,
            success: true,
            type: 'toolSuccess',
        });
    }

    static requestError(request, message) {
        return Notify._post({
            request: request,
            error: message,
            success: false,
            type: 'toolError',
        });
    }

    static developerError(request, message, errorData = null) {
        return Notify._post({
            request: request,
            message: message,
            error: errorData,
            type: 'developerError',
        });
    }
}
