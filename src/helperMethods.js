const config = require('./config');

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

module.exports = {
    getResetPasswordEmailHtml,
    getResetPasswordSuccessEmailHtml,
    getPasswordResetUrl,
    getDate,
}