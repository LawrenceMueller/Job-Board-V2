import { createJobListing } from '../../lib/redis';
let nodeGeocoder = require('node-geocoder');

export default async function handler(req, res) {
  // Get the country, state, city, and zip from the address given
  let options = {
    provider: 'openstreetmap',
  };

  let geoCoder = nodeGeocoder(options);

  await geoCoder
    .geocode(req.body.address)
    .then((res) => {
      req.body.country = res[0].country;
      req.body.state = res[0].state;
      req.body.city = res[0].city;
      req.body.zip = res[0].zipcode;
    })
    .catch((error) => {
      console.log(
        'Error in the create job listing function, specifically the geocodeing bit'
      );
      console.log('Here is the trace');
      console.error(error);
    });

  try {
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
