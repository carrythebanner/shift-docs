/**
 * Events: Displays one or more event times.
 * Used for browsing the calendar so people can find information about interesting rides.
 *
 * This endpoint supports two different queries:
 *   id=caldaily_id ( the time id )
 *   startdate=YYYY-MM-DD & enddate=YYYY-MM-DD
 *   &all=true ( to include soft deleted rides )
 *
 * For example:
 *   http://localhost:3080/api/events.php?id=1893
 *   https://localhost:4443/api/events.php?startdate=2023-03-19&enddate=2023-03-29
 *
 * In both cases it returns a list of events as a JSON object:
 *  {
 *    events: [ {...},  ... ]
 *  }
 *
 * If there is a problem the error code will be 400 with a json response of the form:
 *  {
 *      "error": { "message": "Error message" }
 *  }
 *
 * See also:
 *  https://github.com/shift-org/shift-docs/blob/main/docs/CALENDAR_API.md#viewing-events
 */
const config = require("../config");
const { endpoints } = require("../appEndpoints.js");

// the events endpoint:
exports.get = function(req, res) {
  const info = {
    siteName: config.site.name,
    url: config.site.url(),
    description: config.crawl.description,
    about_page: config.site.aboutPage(),
    help_page: config.site.helpPage(),
    donate_page: config.site.donatePage(),
    apiDocumentation: config.site.apiDocumentationPage(),
    apiEndpoints: endpoints,
  };

  res.set(config.api.header, config.api.version);
  res.json({info});
}
