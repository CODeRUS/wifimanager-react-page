import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop);

function App() {
  const [selectedSsid, setSelectedSsid] = useState({});
  const [ssids, setSsids] = useState([]);
  const [apiError, setApiError] = useState();
  const formRef = useRef(null);

  useEffect(() => {
    async function getSsids() {
      let response = await fetch("/wifiList");

      if (response.ok) {
        let json = await response.json();
        setSsids(json);
      } else {
        setApiError(`HTTP error: ${response.status}`);
      }
    }
    getSsids();
  }, []);

  const handleSelect = index => {
    setSelectedSsid(ssids[index]);
    scrollToRef(formRef);
  };

  return (
    <div className="App">
      <h1>Connect to WiFi</h1>
      <div className="ssids-container">
        {ssids.map((item, index) => (
          <button className="btn btn-block" onClick={() => handleSelect(index)}>
            {item.ssid} - <b>{item.signalStrength}%</b> 📶{" "}
            {item.security === "WEP" && "🔒"}
            {item.security === "WPA2" && "🛡️"}
          </button>
        ))}
      </div>
      {apiError && <div className="error"> ☢ {apiError} </div>}
      <div ref={formRef}>
        {selectedSsid.ssid && (
          <>
            <h2>Connect to {selectedSsid.ssid}</h2>
            {selectedSsid.security && !apiError && (
              <form action="/wifiSave" method="post">
                <div className="form">
                  {selectedSsid.security === "WPA2" && (
                    <input
                      className="input"
                      name="login"
                      type="text"
                      required
                      autocorrect="off"
                      autocapitalize="off"
                      autocomplete="username"
                      placeholder="login"
                    />
                  )}
                  {(selectedSsid.security === "WEP" ||
                    selectedSsid.security === "WPA2") && (
                    <input
                      className="input"
                      name="password"
                      type="password"
                      required
                      autocomplete="current-password"
                      placeholder="password"
                    />
                  )}
                  <input
                    className="hidden"
                    name="ssid"
                    required
                    value={selectedSsid.ssid}
                    type="text"
                    placeholder="ssid"
                  />
                </div>
                <button type="submit" className="btn btn-block text-center">
                  CONNECT
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
