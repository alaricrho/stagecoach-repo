import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function ActiveTicket() {
  const location = useLocation();
  const { code, color, ticket } = location.state;
  const [showCode, setShowCode] = useState(true);
  const [tilt, setTilt] = useState(0);
  // Create a ref for the color-code-container div
  const colorCodeContainerRef = useRef(null);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const monthName = monthNames[currentDate.getMonth()];
  // const date = currentDate.getDate();
  const date = '01 Jul 2025'
  const secondDate = '31 Aug 2025'

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [currentTime, setCurrentTime] = useState(getTimeIn24HrFormat());

  function calculateTimeLeft() {
    // let now = new Date();
    // let nextDay = new Date(
    //   now.getFullYear(),
    //   now.getMonth(),
    //   now.getDate() + 1
    // );
    // let timeLeft = nextDay - now;
    // timeLeft = 535680000;
    // return timeLeft;
    const now = new Date();
  const expiryDate = new Date('2025-07-20T00:00:00'); // Or whatever expiry time you want

  const difference = expiryDate - now;
  return difference > 0 ? difference : 0;
  }

  function getTimeIn24HrFormat() {
    const codeDate = new Date();
    let codeHours = codeDate.getHours();
    let codeMinutes = codeDate.getMinutes();
    codeMinutes = codeMinutes < 10 ? "0" + codeMinutes : codeMinutes;
    const timeString = `${codeHours}:${codeMinutes}`;
    return timeString;
  }

  // useEffect(() => {
  //   const timerId = setInterval(() => {
  //     setTimeLeft(calculateTimeLeft());
  //     setCurrentTime(getTimeIn24HrFormat());
  //   }, 1000);

  //   const switchId = setInterval(() => {
  //     setShowCode((prev) => !prev); // Toggle the showCode state every 3.5 seconds
  //   }, 3500); // 3500 ms is 3.5 seconds

  //   // Add event listener for device orientation
  //   // Check if DeviceOrientationEvent is defined
  //   if (window.DeviceOrientationEvent) {
  //     // Check if the browser requires permission to access device orientation
  //     if (typeof DeviceOrientationEvent.requestPermission === "function") {
  //       // Request permission
  //       DeviceOrientationEvent.requestPermission()
  //         .then((permissionState) => {
  //           if (permissionState === "granted") {
  //             window.addEventListener("deviceorientation", handleOrientation);
  //           }
  //         })
  //         .catch(console.error);
  //     } else {
  //       // For browsers not requiring permission
  //       window.addEventListener("deviceorientation", handleOrientation);
  //     }
  //   }

  //   return () => {
  //     clearInterval(timerId);
  //     clearInterval(switchId);

  //     // Remove event listener for device orientation
  //     if (window.DeviceOrientationEvent) {
  //       window.removeEventListener("deviceorientation", handleOrientation);
  //     }
  //   };
  // }, []);


  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      setCurrentTime(getTimeIn24HrFormat());
    }, 1000);
  
    const switchId = setInterval(() => {
      setShowCode((prev) => !prev);
    }, 3500);
  
    let latestGamma = 0;
    let animationFrameId;
  
    const handleOrientation = (event) => {
      if (typeof event.gamma === "number") {
        latestGamma = event.gamma;
      }
    };
  
    const smoothTilt = () => {
      setTilt((prev) => {
        const diff = latestGamma - prev;
        return prev + diff * 0.1; // 0.1 = smoothing factor
      });
      animationFrameId = requestAnimationFrame(smoothTilt);
    };
  
    // Permission and event listener setup
    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission()
          .then((permissionState) => {
            if (permissionState === "granted") {
              window.addEventListener("deviceorientation", handleOrientation);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    }
  
    // Start animation loop
    animationFrameId = requestAnimationFrame(smoothTilt);
  
    return () => {
      clearInterval(timerId);
      clearInterval(switchId);
      window.removeEventListener("deviceorientation", handleOrientation);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  const handleOrientation = (event) => {
    let { beta } = event;
    // Restrict the tilt to between 0 and 30 degrees
    beta = Math.min(Math.max(beta, 0), 30);
    setTilt(beta);
  };

  return (
    <div>
      <div className="p-5 text-center  full-height" id="outer-container">
        <div
          className="container py-5"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            backgroundColor: "#E5E6E8"
          }}
        >
          <div
            className="h-100 p-5 text-bg-white rounded-3"
            id="active-container"
          >
            <rect width="600px" height="600px" fill="var(--bs-secondary-bg)">
              <img
                src="/images/qr-code.jpeg"
                alt="static-qr-code"
                style={{ height: "600px", width: "600px" }}
              />
            </rect>
            <h1
              className="display-4 fw-bold text-body-emphasis"
              id="ticket-name"
              style={{ width: "calc(100% + 96px)", // 48px padding * 2 (left + right)
              marginLeft: "-48px",        // cancel left padding
              marginRight: "-48px",}}
            >
              {ticket}
            </h1>
            <div className="ticket-info-container">
              <p>1 Student </p>
              <p> £70.00 </p>
            </div>
            
            <div
              className="color-code-container"
              style={{
                backgroundColor: color,
                transform: `rotate(${tilt}deg)`,
                height: '180px',
                width: "calc(100% + 96px)", // 48px padding * 2 (left + right)
                marginLeft: "-48px",        // cancel left padding
                marginRight: "-48px",
                transition: 'transform 0.1s linear' //this is the one changed
              }}
            >
              {showCode ? (
                <p class="color-code" style={{ fontSize: '105px' }}>{code}</p>
              ) : (
                <p class="color-code" style={{ fontSize: '105px' }}>{currentTime}</p>
              )}
              <div class="bubbles">
              <div className="bubble" style={{ width: 15, height: 15, backgroundColor: "rgba(255,255,255,0.3)" }}></div>
              <div className="bubble" style={{ width: 200, height: 200, backgroundColor: "rgba(255,255,255,0.7)" }}></div>
              <div className="bubble" style={{ width: 30, height: 30, backgroundColor: "rgba(255,255,255,0.7)" }}></div> 
              <div className="bubble" style={{ width: 15, height: 15, backgroundColor: "rgba(255,255,255,0.3)" }}></div>
              <div className="bubble" style={{ width: 150, height: 150, backgroundColor: "rgba(255,255,255,0.5)" }}></div>
              <div className="bubble" style={{ width: 30, height: 30, backgroundColor: "rgba(255,255,255,0.7)" }}></div> 
              <div className="bubble" style={{ width: 150, height: 150, backgroundColor: "rgba(255,255,255,0.5)" }}></div>
              <div className="bubble" style={{ width: 130, height: 130, backgroundColor: "rgba(255,255,255,0.4)" }}></div>
              <div className="bubble" style={{ width: 110, height: 110, backgroundColor: "rgba(255,255,255,0.6)" }}></div>
              <div className="bubble" style={{ width: 100, height: 100, backgroundColor: "rgba(255,255,255,0.3)" }}></div>
              <div className="bubble" style={{ width: 150, height: 150, backgroundColor: "rgba(255,255,255,0.5)" }}></div>
              <div className="bubble" style={{ width: 80, height: 80, backgroundColor: "rgba(255,255,255,0.3)" }}></div>
              <div className="bubble" style={{ width: 15, height: 15, backgroundColor: "rgba(255,255,255,0.3)" }}></div>
              <div className="bubble" style={{ width: 15, height: 15, backgroundColor: "rgba(255,255,255,0.3)" }}></div>
              <div className="bubble" style={{ width: 15, height: 15, backgroundColor: "rgba(255,255,255,0.3)" }}></div>
              <div className="bubble" style={{ width: 150, height: 150, backgroundColor: "rgba(255,255,255,0.5)" }}></div>
              <div className="bubble" style={{ width: 30, height: 30, backgroundColor: "rgba(255,255,255,0.7)" }}></div> 
              <div className="bubble" style={{ width: 150, height: 150, backgroundColor: "rgba(255,255,255,0.5)" }}></div>
              <div className="bubble" style={{ width: 130, height: 130, backgroundColor: "rgba(255,255,255,0.4)" }}></div>
              <div className="bubble" style={{ width: 110, height: 110, backgroundColor: "rgba(255,255,255,0.6)" }}></div>
              <div className="bubble" style={{ width: 15, height: 15, backgroundColor: "rgba(255,255,255,0.3)" }}></div>
              <div className="bubble" style={{ width: 200, height: 200, backgroundColor: "rgba(255,255,255,0.7)" }}></div>
              <div className="bubble" style={{ width: 30, height: 30, backgroundColor: "rgba(255,255,255,0.7)" }}></div> 
              <div className="bubble" style={{ width: 15, height: 15, backgroundColor: "rgba(255,255,255,0.3)" }}></div>
              <div className="bubble" style={{ width: 150, height: 150, backgroundColor: "rgba(255,255,255,0.5)" }}></div>
              
              </div>
            </div>
            <p className="valid-date">
              Valid from: 00:00, {date}
            </p>
            <div className="expiry-container">
              <p className="expiry-message"> Tickets expires in </p>
              <p className="count-down">
                {hours}h : {minutes < 10 ? `0${minutes}` : minutes}m :{" "}
                {seconds < 10 ? `0${seconds}` : seconds}s
              </p>
            </div>
            <div className="udid-container">
              <p>1231-20210916131213-232</p>
            </div>
            <p
  style={{
    color: 'green',
    fontSize: '3rem',
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: '40px',
    userSelect: 'none'
  }}
>
  More details&nbsp;&gt;
</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActiveTicket;
