import React from 'react'
import Header from "./Search"
import {GoogleMap, useLoadScript, Marker,InfoWindow} from '@react-google-maps/api'
import Geocode from "react-geocode"


function App() {

  const [data, setData] = React.useState([])
  const [places,setPlaces] = React.useState([])
  const[latlng,setLatlng] = React.useState([])

  


// Article API Call
  async function SearchData(search){
    /* swap if other is over called :81fc5243a6f941ac9ba0c2d04e9e2870 */
  
   const response = await fetch(`https://newsapi.org/v2/everything?q=${search}&from=2023-01-17&sortBy=popularity&pageSize=10&apiKey=81fc5243a6f941ac9ba0c2d04e9e2870`)
  
    const json = await response.json();
    setData(json.articles);
  }
    React.useEffect(() => {
      if (data.length > 0) {
        sendDataToServer();
      }
    }, [data]);

  

// Send data to Node
    function sendDataToServer() {
  
      setPlaces([]);
     
        fetch('http://localhost:5411/sendData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(response => {
          if(response !==null){
            setPlaces(response);
          }
        })
        .catch(error => console.error(error))
      
    }

    //Get lat lng from geocode
React.useEffect(() => {
  if (places.length > 0) {
    Geocode.setApiKey("AIzaSyC-4wYw4_X7q0njT7oyFdBFp2Qx7DCPL7w");
    const filteredPlaces = places.filter(p => p[0]);
    
    const latlng = filteredPlaces.map(p => {
     
      return Geocode.fromAddress(p[0]).then(
        
        (response) => {
          if(response.status === "ZERO_RESULTS"){console.log("no results")}
          else{
          const { lat, lng } = response.results[0].geometry.location;
          return { lat, lng, content:p[1], image:p[2], desc:p[3], auth:p[4], title:p[5],pub:p[6]};
        } 
          
          }
      );
    });
    if(latlng){
    Promise.all(latlng).then(setLatlng);}
    else{console.log('does not work')}
  }
}, [places]);

// Google Map

const {isLoaded} = useLoadScript({googleMapsApiKey:"AIzaSyC-4wYw4_X7q0njT7oyFdBFp2Qx7DCPL7w"});
if(!isLoaded){ 
  return <div>Loading...</div>;
}

function converter(x){ 
  var d = new Date(x);
  var now = new Date();
  var difference = now - d;
  var daysAgo = Math.floor(difference / (1000 * 60 * 60 * 24));
  if (daysAgo <= 1) {
    return "today";
  } else {
    return daysAgo + " days ago";
  }
}
console.log(latlng)
function markers() {
if(latlng.length > 0)

{return latlng.map((latlng) => (
  
  <InfoWindow position={{lat: latlng.lat, lng: latlng.lng}} >
  <div className='Info'>
    <h3>{latlng.title}</h3>
    <img src = {latlng.image} style={{width:"250px"}}/>
    <small style={{color:'grey'}}>{converter(latlng.pub)} • {latlng.auth}</small>

  </div>

</InfoWindow>
))}
}

  return (
    <div>
    <Header SearchData={SearchData} />
    <GoogleMap zoom={3} center={{lat:30.0902,lng:10.7129}} mapContainerClassName="map-container">
    {latlng.length > 0 ? markers() : null}

    </GoogleMap>
  </div>
  )
}

export default App
