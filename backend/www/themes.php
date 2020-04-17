<?php
include('../init.php');

/**
 * This endpoint returns a list of events between the GET parameters startdate and enddate of the form:
 *  JSON:
 *  {
 *      events: [
 *          {
 *
 *          },
 *          ...
 *      ]
 *  }
 *
 * If there is a problem the error code will be 400 with a json response of the form:
 *  {
 *      "error": {
 *          "message": "Error message"
 *      }
 *  }
 */

$json = array();
$json['themes'] = array();
$json['themes'] []= array(
  'title' => 'Bike fun',
  'date' => "2020-06-03",
  'url' => '/pages/mission_statement/'
);
$json['themes'] []= array(
  'title' => 'Mystery rides',
  'date' => "2020-06-11",
  'url' => 'https://midnightmysteryride.wordpress.com/'
);
// $json['themes'] []= array(
//   'title' => 'Pedalpalooza',
//   'date' => "2020-06-01",
//   'end' => "2020-06-30",
//   'url' => '/pages/pedalpalooza/'
// );

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: $ORIGIN");
fJSON::output($json);
