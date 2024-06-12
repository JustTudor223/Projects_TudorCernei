import React, { useState, useEffect } from "react";
import StoreDetails from "../components/StoreDetails";

const StoresMapClient = () => {
  const [map, setMap] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    // Load Google Maps API
    const loadGoogleMapsAPI = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD2-WENmDCAWho2OqjKMJCHTIHvKUCl3G8&libraries=places`;
      script.defer = true;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    // Initialize Map and Markers
    const initMap = async () => {
      const mapOptions = {
        center: { lat: 45.9432, lng: 24.9668 },
        zoom: 7,
      };

      const map = new window.google.maps.Map(
        document.getElementById("map"),
        mapOptions
      );
      setMap(map);

      try {
        // Fetch Store Data
        const response = await fetch("http://localhost:4000/api/store/get");
        const locations = await response.json();
        setStores(locations);

        // Place Markers
        locations.forEach((location) => {
          const { name, address, category, city, image } = location;
          const fullAddress = `${address}, ${city}`;
          const geocoder = new window.google.maps.Geocoder();

          geocoder.geocode({ address: fullAddress }, (results, status) => {
            if (status === "OK" && results[0]) {
              const marker = new window.google.maps.Marker({
                position: results[0].geometry.location,
                map,
                title: name,
              });

              const infoWindow = new window.google.maps.InfoWindow({
                content: `<div>
                            <h3>${name}</h3>
                            <p>${fullAddress}</p>
                            <p>Category: ${category}</p>
                            <img src="${image}" alt="${name}" style="max-width: 100px; max-height: 100px; object-fit: cover;"/>
                            <button id="more-details" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs">
                              More details
                            </button>
                            <button id="get-directions" class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs">
                              Get directions
                            </button>
                          </div>`,
              });

              marker.addListener("click", () => {
                infoWindow.open(map, marker);

                window.google.maps.event.addListener(infoWindow, 'domready', () => {
                  document.getElementById('more-details').addEventListener('click', () => {
                    setSelectedStore(location);
                  });

                  document.getElementById('get-directions').addEventListener('click', () => {
                    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
                    window.open(directionsUrl, '_blank');
                  });
                });
              });
            } else {
              console.error(
                "Geocode was not successful for the following reason:",
                status
              );
            }
          });
        });
      } catch (error) {
        console.error("Error fetching store locations:", error);
      }
    };

    // Load Google Maps API
    loadGoogleMapsAPI();

    // Cleanup Google Maps API
    return () => {
      const script = document.querySelector(
        'script[src^="https://maps.googleapis.com"]'
      );
      if (script) {
        script.remove();
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full"></nav>
      <div
        id="map"
        className="w-[80vw] h-[80vh] ml-auto border border-gray-300 rounded-lg"
      ></div>
      {selectedStore && (
        <StoreDetails
          isOpen={true}
          store={selectedStore}
          onClose={() => setSelectedStore(null)}
        />
      )}
    </div>
  );
};

export default StoresMapClient;
