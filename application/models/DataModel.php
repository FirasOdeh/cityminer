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


    public function importCityPlacesGoogle($city, $country)
    {
        $key = "key=AIzaSyBE6ia5uKlMLjvUfh7hZwtAODnw_wreQ_M";

        $url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=45.750000,4.850000&radius=50000&$key";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $response = json_decode(curl_exec($ch));
        return count($response->results);
    }

    public function camputeStatistics($city, $zone)
    {
        $graph = file_get_contents('./data/cities/'.$city.'/'.'FoursquareGraph.json');
        $graph = preg_replace('/("(.*?)"|(\w+))(\s*:\s*(".*?"|.))/s', '"$2$3"$4', $graph);
        $search = array(' ', "\t", "\n", "\r");
        $graph = str_replace($search, '', $graph);
        $graph = preg_replace("/,}/", '}', $graph);
        $graph = json_decode($graph);
        $attributes = $graph->descriptorsMetaData[0]->attributesName;
        $result = new StdClass();
        $result->attributes = new StdClass();
        $result->sums = new StdClass();
        foreach ($graph->vertices as $vertex){
            if(in_array($vertex->vertexId, $zone)){
                for ($i=0 ; $i<count($attributes); $i++ ){
                    if(property_exists($result->attributes, $attributes[$i])){
                        $result->attributes->{$attributes[$i]} += $vertex->descriptorsValues[0][$i];
                    } else {
                        $result->attributes->{$attributes[$i]} = $vertex->descriptorsValues[0][$i];
                    }
                }

            }
            for ($i=0 ; $i<count($attributes); $i++ ){
                if(property_exists($result->sums, $attributes[$i])){
                    $result->sums->{$attributes[$i]} += $vertex->descriptorsValues[0][$i];
                } else {
                    $result->sums->{$attributes[$i]} = $vertex->descriptorsValues[0][$i];
                }
            }

        }
        return $result;
    }
}