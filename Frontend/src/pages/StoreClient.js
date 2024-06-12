import React, { useState, useEffect, useContext } from "react";
import StoreDetails from "../components/StoreDetails";
import AuthContext from "../AuthContext";

function StoreClient() {
  const [stores, setAllStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetching all stores data
  const fetchData = () => {
    fetch(`http://localhost:4000/api/store/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
        setFilteredStores(data);
      });
  };

  const showDetailsModal = (store) => {
    setSelectedStore(store);
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(value) ||
        store.city.toLowerCase().includes(value)
    );
    setFilteredStores(filtered);
  };

  return (
    <div className="col-span-12 lg:col-span-10 p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Manage Stores</h1>
        <div className="flex justify-between mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by store name or city"
            className="p-2 border rounded w-1/3"
          />
        </div>
        {selectedStore && (
          <StoreDetails
            isOpen={true}
            store={selectedStore}
            onClose={() => setSelectedStore(null)}
          />
        )}
        <div className="flex flex-col gap-6 items-center">
          {filteredStores.map((element) => (
            <div
              className="bg-white border-2 w-11/12 h-fit flex flex-col gap-4 p-4 rounded-lg shadow-md"
              key={element._id}
            >
              <div>
                <img
                  alt="store"
                  className="h-80 w-full object-cover rounded-lg"
                  src={element.image}
                />
              </div>
              <div className="flex flex-col gap-3 justify-between items-start">
                <span className="font-bold text-lg">{element.name}</span>
                <div className="flex justify-between w-full items-center">
                  <div className="flex items-center">
                    <img
                      alt="location-icon"
                      className="h-6 w-6"
                      src={require("../assets/location-icon.png")}
                    />
                    <span className="ml-2">{element.address + ", " + element.city}</span>
                  </div>
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold p-2 text-xs rounded"
                    onClick={() => showDetailsModal(element)}
                  >
                    More Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StoreClient;
