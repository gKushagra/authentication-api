const config = require('./config');

const messageToStatusMap = {
    'OK': 200,
    'Created': 201,
    'No Content': 205,
    'Bad Request': 400,
    'Unauthorized': 401,
    'Forbidden': 403,
    'Not Found': 404,
    'Internal Server Error': 500,
    'Not Implemented': 501,
    'Bad Gateway': 502,
    'Service Unavailable': 503
}

const responseMessages = {
    ok: 'OK',
    created: 'Created',
    badRequest: 'Bad Request',
    unauthorized: 'Unauthorized',
    notFound: 'Not Found',
    serverError: 'Internal Server Error',
}

const getResetPasswordEmailHtml = (url) => {
    return `
      <p>Hello!</p><br><br>
      <p>You requested a password reset link. 
      Please use this<a href="${url}" target="_blank">Link</a> 
      to reset your password.</p><br><br>
      <p>Thanks,<p>
      <p>Softwright Single-Sign On (SSO) Team</p><br>
      <small><b>Important:</b> If you did not initiate this request, 
      report at <b>support@softwright.in</b></small>
    `;
};

const getResetPasswordSuccessEmailHtml = () => {
    return `
      <p>Hello!</p><br><br>
      <p>Your account password has been reset successfully!</p><br><br>
      <p>Thanks,<p>
      <p>Softwright Single-Sign On (SSO) Team</p><br>
      <small><b>Important:</b> If you did not initiate this request, 
      report at <b>support@softwright.in</b></small>
    `;
};

const getPasswordResetUrl = (token, route = "lib/form1/reset") => {
    if (!token) {
        throw new Error("Token not found.")
    } else {
        let url = new URL(config.domain + route);
        url.searchParams.append("token", token);
        return url;
    }
};

const getDate = () => { return new Date(); }

const unwrapResult = (result) => {
    let response = {};
    response['data'] = result.data;
    response['code'] = messageToStatusMap[result.status];
    return response;
}

module.exports = {
    responseMessages,
    getResetPasswordEmailHtml,
    getResetPasswordSuccessEmailHtml,
    getPasswordResetUrl,
    getDate,
    unwrapResult
}