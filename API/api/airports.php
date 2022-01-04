<?php

 include('headers.php');
 include('../db/airports-class.php');

 $db = new SQLite3('../db/store.db');
 $airports = new Airports($db);

// TODO Check 
switch($_SERVER['REQUEST_METHOD']){
    case "GET":
       $all_airports = $airports->read();
       echo(json_encode(["data" => $all_airports]));
        break;
    case "POST":
        $data = json_decode(file_get_contents("php://input"));
        $airports->create($data);
        break;
    case "PUT":
        $data = json_decode(file_get_contents("php://input"));
        $airports->update($data);
        break;
    case "DELETE":
        $data = json_decode(file_get_contents("php://input"));
        $airports->delete($data);
        break;
    default:

        break;
}