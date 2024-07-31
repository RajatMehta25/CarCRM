import React, { useEffect } from "react";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import _ from "lodash";
import axios from "axios";
import Autocomplete from "react-google-autocomplete";
import { Button } from "./";
let map;
const google = window.google;

const ManageRegion = (props) => {
  const {
    onPlaceSelected,
    onDragEnd,
    center,
    value,
    coordinates,
    updateCorditates,
    onChange,
    clearAddress,
    ...rest
  } = props;

  const initMap = (preload = true) => {
    map = new window.google.maps.Map(document.getElementById("map"), {
      center: center,
      zoom: 12,
      // only show roadmap type of map, and disable ability to switch to other type
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
    });
    map.data.setControls(["Polygon"]);
    map.data.setStyle({
      editable: true,
      draggable: true,
    });

    map.data.addListener("addfeature", savePolygon);
    map.data.addListener("removefeature", savePolygon);
    map.data.addListener("setgeometry", savePolygon);

    new google.maps.Marker({
      position: center,
      map,
    });

    //load saved data
    loadPolygons(map, preload);
  };

  const loadPolygons = (map, preload) => {
    var data = preload ? coordinates : null;

    // map.data.forEach(function (f) {
    //     map.data.remove(f);
    // });
    map.data.addGeoJson(data);
  };

  const savePolygon = () => {
    map.data.toGeoJson(function(json) {
      // console.log(JSON.stringify(json));

      updateCorditates(json);
    });
  };
  const clearall = async () => {
    initMap(false);
    clearAddress()
  };

  useEffect(() => {
    initMap(true);
  }, [center]);

  return (
    <div className="container" style={{ height: `100%` }}>
      <div className="map-header">
        <Autocomplete
          style={{
            width: "100%",
            outline: "none",
            border: "1px solid #ccc",
            height: 40,
            borderRadius: 4,
            padding: "10px 12px",
            fontSize: 16,
            letterSpacing: 0.7,
            color: "#000",
          }}
          onPlaceSelected={(place) =>
            onPlaceSelected ? onPlaceSelected(place) : null
          }
          types={["(regions)"]}
          value={value}
        />

        <Button type="button" className="btn-primary" onClick={clearall} label="Reset" />
      </div>
      <div className="maps" id="map"></div>
    </div>
  );
};

export default ManageRegion;
