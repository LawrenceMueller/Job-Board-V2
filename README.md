# Console.job

A job board for developers, named after the line every developer has typed a thousand times: `console.log`.

Employers post a job and pay for the listing with Stripe. Job seekers search by keyword, filter by what matters to them, sort by distance from where they live, and apply by uploading their resume. I built it solo in spring 2022 and launched it publicly at consolejob.com.

**[Watch the demo video](https://youtu.be/daSLAntjGuM)**

## Features

- **Paid job postings** through Stripe Checkout, with support for promotion codes
- **Search and filters:** full-text search on job titles, filters for experience level, position type, salary type, minimum salary and remote work
- **Sort by distance:** addresses are converted to coordinates with Google's Geocoding API, and results are ordered by their distance from the job seeker
- **Applications by email:** applicants upload a PDF resume and an optional cover letter, which are emailed straight to the employer through SendGrid, with a confirmation email to the applicant
- **Self-service removal:** employers get a private removal code by email when they post, and can take their listing down at any time
- **Automatic cleanup:** a scheduled job removes listings after 60 days
- **Installable on phones** as a progressive web app, with mobile-responsive pages throughout

## Tech stack

| | |
|---|---|
| Framework | Next.js 12 and React 17 |
| Backend | Next.js API routes on Node.js |
| Database | Redis, storing listings as JSON documents with a search index (Redis OM) |
| Payments | Stripe Checkout |
| Email | SendGrid |
| Location | Google Geocoding API |
| Hosting | Vercel |

## How it works

**Posting a job.** The employer fills out the listing and pays through Stripe Checkout. The API geocodes the job's location, saves the listing to Redis with a unique page ID and a private removal code, and emails the employer a confirmation with that code.

**Finding a job.** The home page and each job's detail page are statically generated and refreshed every few seconds (Next.js incremental static regeneration), so pages load fast while new listings still appear almost immediately. Searches run full-text matching through the Redis index, apply the filters, and then sort by date or by distance. Employer contact details and removal codes are stripped from every search result.

**Applying.** The applicant's PDFs are uploaded to an API route, attached to an email to the employer, and the listing's application count goes up by one.

## Running it locally

You'll need Node.js, a Redis instance with the search module (Redis Stack, or a free Redis Cloud database), and accounts with Stripe, SendGrid and Google Cloud.

Create a `.env.local` file in the project root (it's in `.gitignore`, so it's never committed):

```
REDIS_URL=
GOOGLE_GEO_API_KEY=
SENDGRID_API_KEY=
STRIPE_SECRET_KEY_LIVE=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE=
NEXT_PUBLIC_GOOGLE_ANALYTICS=
```

Then:

```sh
npm install
npm run dev
```

Open http://localhost:3000, and visit `/api/createIndex` once to build the Redis search index. The Stripe price ID is set in `pages/api/checkout_sessions.js`, so replace it with a product from your own Stripe account. Use Stripe's test keys while trying it out.

This project dates from 2022, so running it on a current Node.js version may need some dependency updates.

## Looking back

This was the project where I learned the most, mostly by hitting problems on a live site: taking real payments, getting scheduled jobs to run reliably, and working around Vercel's caching so new listings showed up. If I built it again today, I would:

- Require authentication on the cleanup and index endpoints, which I left open while debugging the scheduled job
- Define the listing schema in one shared module instead of repeating it in each API route
- Write it in TypeScript and add automated tests
- Push the distance search into the database instead of sorting in application code

## License

All rights reserved. This code is published for viewing only. See [LICENSE](LICENSE).
