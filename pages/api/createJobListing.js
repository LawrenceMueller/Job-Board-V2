import { Client, Entity, Schema, Repository } from 'redis-om';
const mail = require('@sendgrid/mail');
import fetch from 'node-fetch';
import { v4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Initialize SendGrid
    mail.setApiKey(process.env.SENDGRID_API_KEY);

    // Initialize Redis
    const client = new Client();

    async function connect() {
      if (!client.isOpen()) {
        await client.open(process.env.REDIS_URL);
      }
    }

    class JobListing extends Entity {}
    let schema = new Schema(
      JobListing,
      {
        pageId: { type: 'string' },
        removalId: { type: 'string' },
        title: { type: 'string', textSearch: true },
        companyName: { type: 'string' },
        contactEmail: { type: 'string' },
        country: { type: 'string' },
        state: { type: 'string' },
        city: { type: 'string' },
        zip: { type: 'string' },
        lat: { type: 'number' },
        lng: { type: 'number' },
        experience: { type: 'string' },
        telecommute: { type: 'string' },
        positionType: { type: 'string' },
        salaryType: { type: 'string' },
        minimumSalary: { type: 'number' },
        emailForward: { type: 'string' },
        redirectURL: { type: 'string' },
        companyWebsite: { type: 'string' },
        description: { type: 'string', textSearch: true },
        postedTime: { type: 'string' },
        applied: { type: 'number' },
      },
      {
        dataStructure: 'JSON',
      }
    );

    const userInputedData = req.body;

    try {
      // Convert address given to lat and lng for geospatial searching
      await fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          req.body.city +
          '+' +
          req.body.state +
          '+' +
          req.body.zip +
          '&key=' +
          process.env.GOOGLE_GEO_API_KEY
      )
        .then((res) => res.json())
        .then((text) => {
          req.body.lat = text.results[0].geometry.location.lat;
          req.body.lng = text.results[0].geometry.location.lng;
        });

      // Create a unique removal id to allow users to remove listing later on
      userInputedData.removalId = randomString(
        32,
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      );

      // Create a unique page id, in order to navigate to a job details page
      userInputedData.pageId = v4();

      // Get the current date in order to provide information to users
      userInputedData.postedTime = new Date().toString();

      // Initialize amount of people applied to 0
      userInputedData.applied = 0;

      await connect(); // Connect to db

      const repository = new Repository(schema, client); // Create the repository instance

      const jobListing = repository.createEntity(userInputedData); // Create a new jobListing using the data from the front end

      await repository.save(jobListing); // Save new entry to db

      // Set to the email of the company posting, to send a confirmation email
      const emailToSendTo = userInputedData.contactEmail;

      // Create the body of the email
      let message = `
      Thank you for creating the ${userInputedData.title} position listing with Console.job()\r\n
      \r\n
      The following code is your unique removal-id for the position you posted.
      DO NOT SHARE THIS CODE OR LOSE IT. If you fill the position before the 60
      days are up, please use this code to remove the job listing from Console.job()
      by going to the home page and clicking the "Remove Listing" button, then paste
      this code into the field provided and press "remove".
      \r\n
      \r\n
      removal id: <b style="font-size:1.5rem;">${userInputedData.removalId}</b>
      \r\n
      \r\n
      Thank you for using Console.Job(). This is a small business, made by ONE person, 
      so it means a lot that you used this service. Every time a buisness uses this service
      you are helping a developer pay bills. Thank you!
      \r\n
      \r\n
      If you need support, please contact this email: consolejobcontact@gmail.com
    `;

      // Email to the company for confirmation
      let emailData = {
        to: emailToSendTo,
        from: 'consolejob@consolejob.com',
        subject: `You created a job listing for a ${userInputedData.title} position, Thank you!`,
        text: message,
        html: message.replace(/\r\n/g, '<br>'),
      };

      // Send the email to the applicant
      await mail.send(emailData).then(() => {
        res.status(200).json({ msg: 'success' });
      });
    } catch (error) {
      console.log('Error with the creating job listing function');
      console.log('Here is the trace');
      console.error(error);
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}

// Util function to create the random removal id for each job listing
export function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
