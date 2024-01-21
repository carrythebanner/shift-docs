<?php

/**
 * Delete Event: Removes an event from the calendar. 
 * Expects a JSON post with an id and password.
 * 
 *  You can use curl to post json for testing. For example:
 *    curl -k -H 'Content-Type: application/json' -X POST --data-binary \
 *    "@delete_event.json" https://localhost:4443/api/delete_event.php
 *  {
 *      "id": "6245",
 *      "secret": "example"
 *   }
 * 
 * If there was an error ( for example, if the id was missing or the event wasn't found )
 * returns http 400 "Bad Request" and a json error response (see errors.php)
 *
 */

include('../init.php');

function build_json_response() {
    if (!isset($_POST['json'])) {
        $data = json_decode(file_get_contents('php://input'), true);
    } else {
        $data = json_decode($_POST['json'], true);
    }
    if (!$data) {
        return text_error('JSON could not be decoded');
    }

    if (!$data['id']) {
        return text_error('Missing ID', 422);
    }

    // get the event.
    $event = Event::getByID($data['id']);

    // verify the event exists.
    if (!$event) {
        return text_error('Event not found', 404);
    }

    // validate the password.

    if ($_SERVER['HTTP_SECRET']) {
        // use the secret provided in request header, if found
        $secret = $_SERVER['HTTP_SECRET'];
    } else {
        // otherwise use the one in the request data payload
        $secret = $data['secret'];
    }

    // if (!$data['secret']) {
    if (!$secret) {
        // 401 response is most accurate here, but per the spec we need to provide add'l info in the response:
        // https://httpwg.org/specs/rfc9110.html#status.401
        // "The server generating a 401 response MUST send a WWW-Authenticate header field containing at least one challenge applicable to the target resource."
        // header('WWW-Authenticate: Basic realm="event"');
        // response: 'Authorization: Basic {base64 encoding of `username:password`}]'
        // since we don't have usernames and event secret is the password, it would be a base64 encoding of `:secret`
        // this works, but pops a basic auth UI: 
        // header('WWW-Authenticate: Basic realm="event"');
        // return text_error('Missing secret', 401);
        return text_error('Missing secret', 403);
    }

    if (!$event->secretValid($secret)) {
    // if (!$event->secretValid($data['secret'])) {
        $secret_valid = $event->secretValid($secret);
        return text_error('Invalid secret, use link from email', 403);
    }

    // if the event was never published, we can delete it completely.
    if (!$event->isPublished()) {
        try{
            $event->delete();
        } catch(Exception $ex) {
            error_log("couldn't delete event" . $ex->getMessage());
            return text_error('Server error', 500);
        }
    } else {
        try{
            $event->deleteEvent();
        } catch(Exception $ex) {
            error_log("couldn't cancel event " . $ex->getMessage());
            return text_error('Server error', 500);
        }
    }
    // return array('success' => true);
    http_response_code(204);
    return; // null; no body returned if success
}

ob_start();
$response = build_json_response();
$contents = ob_get_contents();
ob_end_clean();
if ($contents) {
    $response['contents'] = $contents;
}
header('Content-Type: application/json');
header('Accept: application/json');
header("Access-Control-Allow-Origin: $ORIGIN");
echo json_encode($response);
