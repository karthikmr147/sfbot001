"use strict";

let nforce = require('nforce'),

SF_CLIENT_ID ='3MVG9uudbyLbNPZNWFfjxFHAGLmTpi3qpP.wY98UXyWcO0B9_ksrO4TwZehf.g1RYHA3Tpmg1oiXgq4TNDlLI',
SF_CLIENT_SECRET ='2043885648495417930',
SF_USER_NAME ='karthikeya.mullunjaramakrishna@sjsu.edu',
SF_PASSWORD ='@Kushal@1991vxQ64ezVksdy0rOAz88FBGdod';


let org = nforce.createConnection({
    clientId: SF_CLIENT_ID,
    clientSecret: SF_CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/oauth/_callback',
    mode: 'single',
    autoRefresh: true
});

let login = () => {
    org.authenticate({username: SF_USER_NAME, password: SF_PASSWORD}, err => {
        if (err) {
            console.error("Authentication error");
            console.error(err);
        } else {
            console.log("Authentication successful");
        }
    });
};

let findAccount = name => {
    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, BillingStreet, BillingCity, BillingState, Picture_URL__c, Phone FROM Account WHERE Name LIKE '%" + name + "%' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let accounts = resp.records;
                resolve(accounts);
            }
        });
    });

};

let findContact = name => {

    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, Title, Account.Name, Phone, MobilePhone, Email, Picture_URL__c FROM Contact WHERE Name LIKE '%" + name + "%' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let contacts = resp.records;
                resolve(contacts);
            }
        });
    });

};

let findContactsByAccount = accountId => {

    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, Title, Account.Name, Phone, MobilePhone, Email, Picture_URL__c FROM Contact WHERE Account.Id = '" + accountId + "' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let contacts = resp.records;
                resolve(contacts);
            }
        });
    });

};

let getTopOpportunities = count => {

    count = count || 5;

    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, Amount, Probability, StageName, CloseDate, Account.Name, Account.Picture_URL__c FROM Opportunity WHERE isClosed=false ORDER BY amount DESC LIMIT " + count;
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.error(err);
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });

};

login();

exports.org = org;
exports.findAccount = findAccount;
exports.findContact = findContact;
exports.findContactsByAccount = findContactsByAccount;
exports.getTopOpportunities = getTopOpportunities;