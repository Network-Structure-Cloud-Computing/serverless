var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-east-1" });
// var DynamoDB = new aws.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    let msg = JSON.parse(event.Records[0].Sns.Message);
    if(!msg.verified) {
        sendEmail(msg);
    }
}

var sendEmail = (data) => {

    let link = `http://${data.domainName}/v1/verifyUserEmail?email=${data.username}&token=${data.token}`;

    // let body = "Hi "+ data.first_name +" ,\n\n"+
    // "Your profile has been created successfully on our application. You need to verify your email address before using your account by clicking on this link:" +"\n"+ link + "\n\n\n"+
    // "Thanks & Regards,\n noreply@"+data.domainName
    let body = `<html><body>Hi ${data.first_name} ${data.lastName},<br> Your profile has been created successfully on our application. You need to verify your email address before using your account by clicking on this link: <br><br><a href=${link}>Verify your account</a><br><br><br> Kind Regards,<br> <strong>noreply@${data.domainName}<strong></body></html>`
    let from = "noreply@"+data.domainName
    let emailBody = {
        Destination: {
            ToAddresses: [data.username],
        },
        Message: {
            Body: {
                Text: { Data: body },
            },
            Subject: { Data: "User Account Verification Email" },
        },
        Source: from,
    };

    let sendEmailProm = ses.sendEmail(emailBody).promise()
    sendEmailProm
        .then(function(result) {
            console.log(result);
        })
        .catch(function(err) {
            console.error(err, err.stack);
        });
}