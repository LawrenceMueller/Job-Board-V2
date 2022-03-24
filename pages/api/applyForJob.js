import { Client, Entity, Schema, Repository } from 'redis-om';
const mail = require('@sendgrid/mail');
import formidable from 'formidable';
import * as fs from 'fs';

export default async function handler(req, res) {
  console.log(req.body);
  if (req.method === 'POST') {
    if (!(await validateCaptcha(req.body['g-recaptcha-response']))) {
      return res.redirect(`/captcha`);
    }
    delete req.body['g-recaptcha-response'];

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

    const data = await new Promise(function (resolve, reject) {
      const form = new formidable.IncomingForm();

      form.parse(req, function (err, fields, files) {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const jobPageId = data.fields.positionPageId;

    let resume;
    let coverLetter;

    if (data.files.resume.mimetype !== 'application/pdf') {
      res.status(500).json({ msg: 'resume wrong file type' });
      return;
    }

    await fs.readFile(data.files.resume.filepath, (err, tempResume) => {
      if (err) {
        console.log(err);
      }
      resume = tempResume;
    });

    if (data.files.coverLetter) {
      if (data.files.coverLetter.mimetype !== 'application/pdf') {
        res.status(500).json({ msg: 'cover letter wrong file type' });
        return;
      }

      await fs.readFile(
        data.files.coverLetter.filepath,
        (err, tempCoverLetter) => {
          if (err) {
            console.log(err);
          }
          coverLetter = tempCoverLetter;
        }
      );
    }

    try {
      await connect(); // Connect to db

      const repository = new Repository(schema, client); // Create the repository instance

      let jobListing = await repository
        .search()
        .where('pageId')
        .equals(jobPageId)
        .return.all();

      // Get the email address of the client to send the applicants information to
      let emailToSendTo = jobListing[0].entityData.emailForward;

      // Create the body of the email
      let message = `
  A new candidate has applied through Console.job!\r\n\
  Here is the information they provided:\r\n
  \r\n
  Name: ${data.fields.firstName} ${data.fields.lastName}\r\n
  Email: ${data.fields.email}\r\n
  Phone: ${data.fields.phone}\r\n
  \r\n
  Attached to this email you will find the candidate's resume, and cover letter if they provided it.\r\n
  \r\n
  Console.Job() is a small business, made by ONE person, so it means a lot that you used this service. Thank you!
`;

      // Get the resume and cover letter if need be
      const resumeTextBuffered = Buffer.from(resume);
      let emailData;

      if (data.files.coverLetter) {
        const coverLetterTextBuffered = Buffer.from(coverLetter);

        // Email with both resume and cover letter
        emailData = {
          to: emailToSendTo,
          from: 'consolejob@consolejob.com',
          subject: `New candidate for your ${data.fields.position} posting`,
          text: message,
          html: message.replace(/\r\n/g, '<br>'),
          attachments: [
            {
              content: resumeTextBuffered.toString('base64'),
              filename: data.files.resume.originalFilename,
              type: 'application/pdf',
              disposition: 'attachment',
              content_id: 'candidateResume',
            },
            {
              content: coverLetterTextBuffered.toString('base64'),
              filename: data.files.coverLetter.originalFilename,
              type: 'application/pdf',
              disposition: 'attachment',
              content_id: 'candidateCoverLetter',
            },
          ],
        };
      } else {
        // Email for a candidate that just provided the resume
        emailData = {
          to: emailToSendTo,
          from: 'consolejob@consolejob.com',
          subject: `New candidate for your ${data.fields.position} posting`,
          text: message,
          html: message.replace(/\r\n/g, '<br>'),
          attachments: [
            {
              content: resumeTextBuffered.toString('base64'),
              filename: data.files.resume.originalFilename,
              type: 'application/pdf',
              disposition: 'attachment',
              content_id: 'candidateResume',
            },
          ],
        };
      }

      // Send the email to the client
      await mail.send(emailData);

      // Update the job applied for by adding one to its applied count
      jobListing[0].applied = jobListing[0].applied + 1;
      await repository.save(jobListing[0]);

      // Set to the email of the applicant to send a confirmation email
      emailToSendTo = jobListing[0].entityData.emailForward;

      // Create the body of the email
      message = `
  Thank you for applying for the ${jobListing[0].title} position with ${jobListing[0].companyName}\r\n\
  This email is just a confirmation for your records.\r\n
  \r\n
  \r\n
  Thank you for using Console.Job(). This is a small business, made by ONE person, 
  so it means a lot that you used this service. Every time an applicant applies it gives 
  companies more faith in our service. Thank you!
`;

      // Email to the candidate for confirmation
      emailData = {
        to: emailToSendTo,
        from: 'consolejob@consolejob.com',
        subject: `You applied for the ${jobListing[0].title} position with ${jobListing[0].companyName}`,
        text: message,
        html: message.replace(/\r\n/g, '<br>'),
      };

      // Send the email to the applicant
      await mail.send(emailData).then(() => {
        res.status(200).json({ msg: 'success' });
      });
    } catch (error) {
      console.log('Error in the apply for a job function');
      console.log('Here is the trace');
      console.error(error);
      res.status(500).json({ msg: 'Failed to apply for the job' });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}

// Disable default request body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

const validateCaptcha = (response_key) => {
  return new Promise((resolve, reject) => {
    const secret_key = process.env.RECAPTCHA_SECRET_KEY;

    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

    fetch(url, {
      method: 'post',
    })
      .then((response) => response.json())
      .then((google_response) => {
        if (google_response.success == true) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        console.log(err);
        resolve(false);
      });
  });
};
