const mongoose = require('mongoose');
const { v4: guid } = require('uuid');

const { Schema } = mongoose;

const OrganizationSchema = new Schema({
    name: String,
    email: String,
    redirectUrl: String,
    apiKey: String,
    options: {
        cookies: Boolean,
        jsonWebToken: Boolean
    },
    applications: Array
});

OrganizationSchema.methods.addOrganization = (
    _ = { name, email, redirect_url, options }
) => {
    this.name = _.name;
    this.email = _.email;
    this.redirectUrl = _.redirect_url;
    this.apiKey = guid();
    this.options = options;
    this.applications = [];
}

OrganizationSchema.methods.updateApplications = (applications) => {
    applications.forEach(application => {
        if (!this.applications.find(a => a === application)) {
            this.applications.push(application);
        }
    });
}

mongoose.model("Organization", OrganizationSchema);