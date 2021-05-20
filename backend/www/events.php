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

if (isset($_GET['startdate']) && ($parseddate = strtotime($_GET['startdate']))) {
    $startdate = $parseddate;
} else {
    $startdate = time();
}

if (isset($_GET['enddate']) && ($parseddate = strtotime($_GET['enddate']))) {
    $enddate = $parseddate;
} else {
    $enddate = time();
}

$json = array();

function daysInRange($startdate, $enddate) {
    $days = 86400; // seconds in a day
    return round(($enddate / $days) - ($startdate / $days));
}

if ($enddate < $startdate) {
    http_response_code(400);
    $message = "enddate: " . date('Y-m-d', $enddate) . " is before startdate: " . date('Y-m-d', $startdate);
    $json['error'] = array(
        'message' => $message
    );
} elseif (daysInRange($startdate, $enddate) > 100) {
    http_response_code(400);
    $message = "event range too large: " . daysInRange($startdate, $enddate) . " days requested; max 100 days";
    $json['error'] = array(
        'message' => $message
    );
} else {
    $json['events'] = array();

    if (isset($_GET['id'])) {
        $events = EventTime::getByID($_GET['id']);
        try {
            // check if event was found
            $event = $events[0];
        }
        catch (Exception $ex) {
            http_response_code(404);
            $json['error'] = array(
                'message' => "event not found"
            );
        }
    }
    else {
        $events = EventTime::getRangeVisible($startdate, $enddate);
    }

    foreach ($events as $eventTime) {
        try {
            $json['events'] []= $eventTime->toEventSummaryArray();
        } catch( Exception $ex ) {
            http_response_code(500);
            $message = "unexpected server error";
            $json['error'] = array(
                'message' => $message
            );
        }

    }
}
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: $ORIGIN");
fJSON::output($json);
