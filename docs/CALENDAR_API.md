# Calendar API

**Work in progress**

----

## General

Base URL:
* production: `https://www.shift2bikes.org/api/`
* local development: `https://localhost:4443/api/`

Most responses are in JSON format, except for:
* event export returns vCalendar format
* event crawl returns HTML

## Viewing events

### Retrieving public event data

Endpoint:
* GET `events`

Example requests:
* `/events.php?startdate=2019-06-01&enddate=2019-06-15`
* `/events.php?id=1234`

URL parameters:
* `startdate`:
  * first day of range, inclusive
  * `YYYY-MM-DD` format
  * if not provided, current date is used
* `enddate`:
  * last day of range, inclusive
  * `YYYY-MM-DD` format
  * if not provided, current date is used
* `id`:
  * `caldaily` event ID
  * if `id` is provided, it takes precedence over `startdate` and `enddate`; the date range will be ignored

Unknown parameters are ignored.

It is recommended that you always provide either an event `id` or both `startdate` and `enddate`. Relying on default or inferred values may return unexpected results.

Success:
* status code: `200`
* `events`: array of event objects; array may be empty
* each event object: key-value pairs of all available public fields; does not contain any private fields (use `manage_event` endpoint for those)
* when using `id` parameter, array is expected to return 1 object; if the ID does not match a known event, you will receive a `200` response with an empty `events` array

Example response:

    {
      "events": [
        {
          "id": "6245",
          "title": "Shift to Pedalpalooza Ride",
          "venue": "director park",
          "address": "877 SW park",
          "organizer": "fool",
          "details": "Have you ever wondered how Pedalpalooza happens every year...and did you know we have a team of programmers who work on the shift calendar and website.  There is a lot of rewarding volunteer work that goes on behind the scenes and we are recruiting for new folks who are interested in helping out next year and beyond.  Come on this ride and we will talk a little bit about the history of shift and try to find you a place to help out in the future.  We will end at a family friendly watering hole.  First round of drinks is on shift.  We will be done by 8 so you can check out other rides.",
          "time": "18:00:00",
          "hideemail": "1",
          "length": null,
          "timedetails": null,
          "locdetails": null,
          "eventduration": "120",
          "weburl": null,
          "webname": "shift",
          "image": "/eventimages/6245.jpg",
          "audience": "G",
          "tinytitle": "shift2pedalpalooza",
          "printdescr": "learn how to get involved with shift and pedalpalooza",
          "datestype": "O",
          "area": "P",
          "featured": false,
          "printemail": false,
          "printphone": false,
          "printweburl": false,
          "printcontact": false,
          "email": null,
          "phone": null,
          "contact": null,
          "date": "2017-06-05",
          "caldaily_id": "9300",
          "shareable": "https://shift2bikes.org/calendar/event-9300",
          "cancelled": false,
          "newsflash": null,
          "endtime": "20:00:00"
        }
      ]
    }

Errors:
* status code: `400`
* `error`: object containing `message` key
* `message`: text string explaining the error
* possible errors
  * `enddate` before `startdate`
  * date range too large (100 days maximum)

Example error:

    {
      "error": {
        "message": "enddate: 2019-06-01 is before startdate: 2019-06-15"
      }
    }


### Exporting an event

Endpoint:
* GET `ics`

Example request:
* `/ics.php?id=1234`

URL parameters:
* `id`: `calevent` event ID

Errors:
* status code: `404`
* possible errors
  * no `id` specified
  * `id` not found? (**TODO**: verify)


### Crawling an event

Endpoint:
* GET `crawl`

Example request:
* `/crawl.php?id=1234`

URL parameters:
* `id`: `caldaily` event ID

Unknown parameters are ignored.

This endpoint is used by web crawlers such as search engines.

Success:
* status code: `200`
* returns a simple HTML rendering of ride data
* if `id` parameter is not present, a short, general message about Shift


Example response:

    <html>
        <head>
            <title>Shift to Pedalpalooza Ride</title>
            <meta property="og:title" content="Shift to Pedalpalooza Ride">
            <meta property="og:url" content="https://www.shift2bikes.org/calendar/event-9300">
            <meta property="og:image" content="https://www.shift2bikes.org/eventimages/6245.jpg">
            <meta property="og:type" content="article">
            <meta property="og:description" content="Have you ever wondered how Pedalpalooza happens every year...and did you know we have a team of programmers who work on the shift calendar and website.  There is a lot of rewarding volunteer work that goes on behind the scenes and we are recruiting for new folks who are interested in helping out next year and beyond.  Come on this ride and we will talk a little bit about the history of shift and try to find you a place to help out in the future.  We will end at a family friendly watering hole.  First round of drinks is on shift.  We will be done by 8 so you can check out other rides.">
            <meta property="og:site_name" content="SHIFT to Bikes">
            <meta name="description" content="Have you ever wondered how Pedalpalooza happens every year...and did you know we have a team of programmers who work on the shift calendar and website.  There is a lot of rewarding volunteer work that goes on behind the scenes and we are recruiting for new folks who are interested in helping out next year and beyond.  Come on this ride and we will talk a little bit about the history of shift and try to find you a place to help out in the future.  We will end at a family friendly watering hole.  First round of drinks is on shift.  We will be done by 8 so you can check out other rides.">
            <meta name="keywords" content="bikes,fun,friends,Portland,exercise,community,social,events,outdoors">
        </head>
        <body>
            <h2>Mon, Jun 5th, 6:00 PM - Shift to Pedalpalooza Ride</h2>
            <p>Have you ever wondered how Pedalpalooza happens every year...and did you know we have a team of programmers who work on the shift calendar and website.  There is a lot of rewarding volunteer work that goes on behind the scenes and we are recruiting for new folks who are interested in helping out next year and beyond.  Come on this ride and we will talk a little bit about the history of shift and try to find you a place to help out in the future.  We will end at a family friendly watering hole.  First round of drinks is on shift.  We will be done by 8 so you can check out other rides.</p>
            <p>877 SW park</p>
            <img src="https://www.shift2bikes.org/eventimages/6245.jpg">
        </body>
    </html>

Errors:
* status code: `404`
* body of response is empty
* possible errors
  * `id` not found
  * `id` of a hidden (unpublished) event


## Managing events

### Retrieving all event data

Endpoint:
* GET `retrieve_event`

URL parameters:
* `id`: `calevent` event ID
* `secret`: event password

The `retrieve_event` endpoint returns all private data for the event (if the `secret` is provided) so it can be edited. If you just want to retrieve public data to display the event, use the `event` endpoint.

Success:
* status code: `200`
* key-value pairs of all available fields; the response is similar to the `event` endpoint's event object, but note that they are not identical (the `datestatuses` block, for example)
* if a valid `secret` is provided, all stored values are returned; if not, you still get a `200` response but private fields (e.g. `email`) will be empty

Example response:

    {
      "id": "6245",
      "title": "Shift to Pedalpalooza Ride",
      "venue": "director park",
      "address": "877 SW park",
      "organizer": "fool",
      "details": "Have you ever wondered how Pedalpalooza happens every year...and did you know we have a team of programmers who work on the shift calendar and website.  There is a lot of rewarding volunteer work that goes on behind the scenes and we are recruiting for new folks who are interested in helping out next year and beyond.  Come on this ride and we will talk a little bit about the history of shift and try to find you a place to help out in the future.  We will end at a family friendly watering hole.  First round of drinks is on shift.  We will be done by 8 so you can check out other rides.",
      "time": "18:00:00",
      "hideemail": "1",
      "length": null,
      "timedetails": null,
      "locdetails": null,
      "eventduration": "120",
      "weburl": null,
      "webname": "shift",
      "image": "\\/eventimages\\/6245.jpg",
      "audience": "G",
      "tinytitle": "shift2pedalpalooza",
      "printdescr": "learn how to get involved with shift and pedalpalooza",
      "datestype": "O",
      "area": "P",
      "featured": false,
      "printemail": false,
      "printphone": false,
      "printweburl": false,
      "printcontact": false,
      "email": "user@example.com",
      "phone": null,
      "contact": null,
      "datestatuses": [
        {
          "id": "9300",
          "date": "2017-06-05",
          "status": "A",
          "newsflash": null
        }
      ]
    }

Errors:
* status code: `400`
* possible errors
  * no `id` specified
  * `id` not found


### Adding or updating an event

Endpoint:
* POST `manage_event`

**TODO**


### Deleting an event

Endpoint:
* POST `delete_event`

URL parameters:
* none

Request body:
* `id`: `calevent` event ID
* `secret`: event password

Unknown properties are ignored.

Example request:

    {
        "id": "6245",
        "secret": "example"
    }

Success:
* status code: `204`

Example response:

(no body)

Errors:
* status codes: `400`, `403`, `404`
* possible errors
  * no request body or not parseable JSON (`400`)
  * `id` not included (`400`)
  * invalid `id` (`404`)
  * invalid or missing `secret` (`403`)

Example error:

    {
      "error": {
        "message": "Invalid secret, use link from email"
      }
    }
