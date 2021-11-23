import React, { useEffect } from "react";
import RenderMaps from "./RenderMaps";
import ViewItinerary from "./ViewItinerary";
import TypewriterEffect from "./TypewriterEffect";

const defaultMapObject = {
  isPrivate: false,
  isPublished: true,
  likes: null,
  mapID: "kwaz7tpi",
  datePublished: "2021-11-22T18:02:10.086Z",
  markers: [
    {
      place: {
        url: "https://maps.google.com/?cid=2835734108212231240",
        types: [
          "park",
          "tourist_attraction",
          "point_of_interest",
          "establishment",
        ],
        formatted_address: "Valley Green Rd, Philadelphia, PA 19128, USA",
        name: "Wissahickon Valley Park",
        html_attributions: [],
        place_id: "ChIJIcPcqf64xokRSPxypSWNWic",
        geometry: {
          viewport: {
            west: -75.23120479999999,
            south: 40.04424675000002,
            east: -75.2072252,
            north: 40.09125094999999,
          },
          location: {
            lng: -75.21733100000002,
            lat: 40.0562108,
          },
        },
      },
      userInputData: [
        {
          id: "date",
          value: "2021-11-27",
        },
        {
          value: "09:00",
          id: "time",
        },
        {
          id: "what",
          value: "Morning hike in the crisp autumn air.",
        },
      ],
      order: 1,
      id: "kwayu6ep",
      coordinates: {
        lng: -75.21733100000002,
        lat: 40.0562108,
      },
    },
    {
      coordinates: {
        lat: 39.9606433,
        lng: -75.17280749999999,
      },
      userInputData: [
        {
          id: "date",
          value: "2021-11-27",
        },
        {
          value: "12:00",
          id: "time",
        },
        {
          value: "Get cultured with culture.",
          id: "what",
        },
      ],
      place: {
        name: "Barnes Foundation",
        place_id: "ChIJrcsBU8vHxokR4FXP2BplJks",
        geometry: {
          location: {
            lat: 39.9606433,
            lng: -75.17280749999999,
          },
          viewport: {
            east: -75.17088431970848,
            south: 39.95855865,
            north: 39.96185325,
            west: -75.1735822802915,
          },
        },
        html_attributions: [],
        url: "https://maps.google.com/?cid=5415126767940621792",
        types: [
          "tourist_attraction",
          "museum",
          "point_of_interest",
          "establishment",
        ],
        formatted_address:
          "2025 Benjamin Franklin Pkwy, Philadelphia, PA 19130, USA",
      },
      order: 2,
      id: "kwayvbw2",
    },
    {
      coordinates: {
        lng: -75.1284795,
        lat: 39.9662739,
      },
      userInputData: [
        {
          id: "date",
          value: "2021-11-27",
        },
        {
          value: "18:00",
          id: "time",
        },
        {
          value:
            "Be awed by the colors of sunset as they backdrop the Ben Franklin Bridge.",
          id: "what",
        },
      ],
      id: "kwaz4z7t",
      place: {
        place_id: "ChIJRycq6ELIxokRqyoKN58WSZk",
        html_attributions: [],
        url: "https://maps.google.com/?cid=11045384434181876395",
        geometry: {
          location: {
            lat: 39.9662739,
            lng: -75.1284795,
          },
          viewport: {
            east: -75.127678,
            west: -75.13088400000001,
            north: 39.9679287302915,
            south: 39.9652307697085,
          },
        },
        formatted_address: "1301 N Beach St, Philadelphia, PA 19125, USA",
        name: "Penn Treaty Park",
        types: [
          "park",
          "tourist_attraction",
          "point_of_interest",
          "establishment",
        ],
      },
      order: 3,
    },
    {
      coordinates: {
        lng: -75.1350602,
        lat: 39.9655615,
      },
      order: 4,
      id: "kwaz7jf6",
      userInputData: [
        {
          value: "2021-11-27",
          id: "date",
        },
        {
          value: "21:00",
          id: "time",
        },
        {
          value: "Feed the ears some music.",
          id: "what",
        },
      ],
      place: {
        name: "The Fillmore Philadelphia",
        formatted_address: "29 E Allen St, Philadelphia, PA 19123, USA",
        geometry: {
          location: {
            lat: 39.9655615,
            lng: -75.1350602,
          },
          viewport: {
            west: -75.1364447802915,
            east: -75.13374681970849,
            south: 39.9641309197085,
            north: 39.9668288802915,
          },
        },
        types: ["bar", "point_of_interest", "store", "establishment"],
        html_attributions: [],
        place_id: "ChIJ7wchMmbIxokRzO3qOFuSrC8",
        url: "https://maps.google.com/?cid=3435281536271445452",
      },
    },
  ],
  owner: {
    ownerName: "Jeremy Myers",
    ownerId: "0RkquKMMUkdwM5s92OpMjMBW2Ix1",
  },
  comments: [],
  mapTitle: "Philly Adventuring",
};

function Home(props) {
  return (
    <div id="home-container">
      {props.userAuth ? (
        <div className="map-feed">
          <h2 className="view-maps-header">ACTIVITY FEED</h2>
          {props.publicMaps.map((mapArray) => {
            return (
              <div>
                <RenderMaps
                  db={props.db}
                  userAuth={props.userAuth}
                  mapObject={mapArray[1].mapObject}
                  publicMaps={props.publicMaps}
                  setPublicMaps={props.setPublicMaps}
                  userData={props.userData}
                  setUserData={props.setUserData}
                ></RenderMaps>
              </div>
            );
          })}
        </div>
      ) : (
        <div id="home-no-userAuth">
          <TypewriterEffect
            userAuth={props.userAuth}
            setUserAuth={props.setuserAuth}
          ></TypewriterEffect>
          <div className="home-no-userAuth-map">
            <RenderMaps
              db={props.db}
              userAuth={{ displayName: null, uid: null }}
              mapObject={defaultMapObject}
            ></RenderMaps>
            <ViewItinerary
              userAuth={{ displayName: null, uid: null }}
              mapObject={defaultMapObject}
              markers={defaultMapObject.markers}
            ></ViewItinerary>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
