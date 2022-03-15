import { Client, Entity, Schema, Repository } from 'redis-om';
const mail = require('@sendgrid/mail');
import formidable from 'formidable';

export default async function handler(req, res) {
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
    },
    {
      dataStructure: 'JSON',
    }
  );

  const data = await new Promise(function (resolve, reject) {
    const form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  console.log(data);
  const jobPageId = data.fields.positionPageId;

  try {
    await connect(); // Connect to db

    const repository = new Repository(schema, client); // Create the repository instance

    let jobListing = await repository
      .search()
      .where('pageId')
      .equals(jobPageId)
      .return.all();

    const emailToSendTo = jobListing[0].entityData.contactEmail;

    const message = `
    New candidate that applied through Console.job!\r\n\
    Here is the information they provided:\r\n
    \r\n
    Name: ${data.fields.firstName} ${data.fields.lastName}\r\n
    Email: ${data.fields.email}\r\n
    Phone: ${data.fields.phone}\r\n
    \r\n
    Attached to this email you will find the candidate's resume, and cover letter if they provided it.\r\n
    \r\n
    Console.Job() is a small buisness, made by ONE person, so it means a lot that you used this service. Thank you
  `;

    const emailData = {
      to: emailToSendTo,
      from: 'consolejob@consolejob.com',
      subject: `New candidate for your ${data.fields.position} posting`,
      text: message,
      html: message.replace(/\r\n/g, '<br>'),
    };

    await mail.send(emailData).then(() => {
      res.status(200).json({ msg: 'success' });
    });
  } catch (error) {
    console.log('Error in the apply for a job function');
    console.log('Here is the trace');
    console.error(error);
    res.status(500).json({ msg: 'Failed to apply for the job' });
  }
}

// Disable default request body parser
export const config = {
  api: {
    bodyParser: false,
  },
};
