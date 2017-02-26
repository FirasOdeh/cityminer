<?php

/**
 * Created by PhpStorm.
 * User: zekri
 * Date: 17/02/17
 * Time: 01:48
 */
class DataModel extends CI_Model {

    public function getCityAreas($city)
    {
        $response = file_get_contents('./data/cities/'.$city.'/'.'FoursquareVerticesCoordinates.json');
        return $response;
    }

    public function algoExpress($city)
    {
        copy('./data/cities/'.$city.'/'.'FoursquareGraph.json' , "./data/algorithms/express/FoursquareGraph.json");
        chdir("data/algorithms/express/");
        exec("java -jar EXPRESS.jar",$k ,$j );
        $response = file_get_contents("retrievedPatternsFile.json");
        unlink("retrievedPatternsFile.json");
        unlink("resultIndicatorFile.txt");
        unlink("FoursquareGraph.json");
        return $response;
    }

    public function executeExpress($city, $sigma, $delta, $time)
    {
        copy('./data/cities/'.$city.'/'.'FoursquareGraph.json' , "./data/algorithms/express/FoursquareGraph.json");
        chdir("data/algorithms/express/");
        exec("java -jar express.jar FoursquareGraph.json " . $delta . " " . $sigma . " " . $time ,$k ,$j );
        $response = file_get_contents("retrievedPatternsFile.json");
        unlink("retrievedPatternsFile.json");
        unlink("resultIndicatorFile.txt");
        unlink("FoursquareGraph.json");
        return $response;
    }

    public function executeEnergetics($city, $sigma, $delta, $minCov)
    {
        copy('./data/cities/'.$city.'/'.'FoursquareGraph.json' , "./data/algorithms/energetics/FoursquareGraph.json");
        chdir("data/algorithms/energetics/");
        exec("java -jar energetics.jar FoursquareGraph.json " . $delta . " " . $sigma . " " . $minCov ,$k ,$j );
        $response = file_get_contents("retrievedPatternsFile.json");
        unlink("retrievedPatternsFile.json");
        unlink("resultIndicatorFile.txt");
        unlink("FoursquareGraph.json");
        return $response;
    }
}