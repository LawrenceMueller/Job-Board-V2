import { createJobListing } from '../../lib/redis';

export default async function handler(req, res) {
  try {
    // Convert address given to lat and lng for geospatial searching
    fetch(
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

    const response = await createJobListing(req.body);
    response === 'error'
      ? res.status(500)
      : res.status(200).json({ msg: 'success' });
  } catch (error) {
    console.log('Error with calling the post job listing function');
    console.log('Here is the trace');
    console.error(error);
  }
}
