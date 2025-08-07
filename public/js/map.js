// <!-- belw code has beeen pasted from mapbox documentation but then converted to maptiler type -->
//  <!--  window.onload basically waits till all html,css , js is loaded then it runs its own code in the end -->

window.addEventListener("DOMContentLoaded", function () {
  const mapDiv = document.getElementById("map");

  // Read coordinates from data attribute and parse to array
  const coords = JSON.parse(mapDiv.dataset.coordinates);

  const maptilerInterval = setInterval(() => {
    if (typeof maptilersdk !== "undefined") {//iska mtlb maptiler ki koi key milti hai
      clearInterval(maptilerInterval);//toh jo set interval lagaya hain that would be removed
      //then key ke help se map will be initialised
      maptilersdk.config.apiKey = mapToken; // mapToken should be globally defined before this script

      const map = new maptilersdk.Map({
        container: "map",
        style: "https://api.maptiler.com/maps/streets/style.json",
        center: coords,
        zoom: 10,
        attributionControl: false
      });
          // <!-- below code is to create a red pin on the map at the listing's location -->
      const marker = new maptilersdk.Marker({ color: "red" })
        .setLngLat(coords)
        .setPopup(
          new maptilersdk.Popup({ offset: 25 }).setHTML(
            `<h4>${listingLocation}</h4><p>Exact location provided after booking</p>`
          )
        )
        .addTo(map);
    }
  }, 50);
});
