# Badgelor

Badgelor is a badge system for University of Koblenz - Landau. It's purpose is to create, issue and manage Badges. Students can apply, earn and share their badges to the badge community.

## Built with

1. Angular 5
2. Meteor 1.6
3. Bootstrap 4
4. Typescript
5. MongoDB
6. [Simple icons](https://web.archive.org/web/20180724133539/http://simplelineicons.com/)
7. [Robo3T](https://robomongo.org/) - A GUI for MongoDB
8. Open Badge Factory [REST API](https://openbadgefactory.com/developers/#h1-2-h2-6-h3-2)

## Running Locally

1. Clone the repo
2. Install [Meteor](https://www.meteor.com/)
3. Install [node.js](https://nodejs.org/en/)
4. Generate a certificate and a key for the OBF API. You can do this by following [their tutorial](https://openbadgefactory.com/developers/#h1-2-h2-1) or with [this script](https://github.com/turbopope/obf-certificate-request) (_recommended_).
5. Create a **settings-development.json** file in the project root folder. Here is an example of how the file will look like. This keys showing in this file are some random characters. Update them with actual value. An admin needs to setup before running the application for the first time. Enter the email address of the admin to the “adminEmail” key. This is the user who would login to the system for the first time.

```json
{
  "public": {

  },
  "private": {
    "adminLogin"  : "12345",
    "adminEmail"  : "nizam@uni-koblenz.de",
    "obfCertificate" : [
      "-----BEGIN CERTIFICATE-----",
      "MIIDDjCCAfYCAgZ8MA0GCSqGSIb3DQEBCwUAMIGBMQswCQYDVQQGEwJGSTEQMA4G",
      "-----END CERTIFICATE-----"
    ]
    ,
    "obfKey" :  [
      "-----BEGIN PRIVATE KEY-----",
      "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLSi7ELJAD6rv6",
      "-----END PRIVATE KEY-----"
    ]
  }
}
```

6. Go to the project root directory in your terminal and run the following command `meteor npm install`. In case of any permission error use sudo.
7. And then in terminal from the project root folder run `meteor --settings settings-development.json`.
8. The server will be available at <http://localhost:3000>.

## Deployment
There are several ways to deploy a meteor application. Badgelor was deployed and tested in [Digital ocean](https://www.digitalocean.com/) with the following two tools.
- Command line deployment tool [Meteor up](https://github.com/zodern/meteor-up)
- An open source web application server [Passenger phusion](https://www.phusionpassenger.com/library/walkthroughs/deploy/meteor/ownserver/integration_mode.html)

#### Some useful resources about meteor app deployment

1. <http://hb5.co/p/mup/meteor_up.pdf>
2. <http://meteortips.com/deployment-tutorial/digitalocean-part-1/>
3. <https://github.com/zodern/meteor-up>
4. <https://www.phusionpassenger.com/library/>

## (Feature <-> Role) mapping
![Role image](public/images/roles.png)

## Acknowledgments

- Dr. Peter Ferdinand
- Dr. Ingo Dahn
- Dr. Andreas Kämper
- Sergei Pachtchenko
- Marco Brack
