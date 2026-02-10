import React, { useEffect, useState } from "react";

export interface SplashScreenProps {
  onLoadingComplete?: () => void;
  minDuration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onLoadingComplete,
  minDuration = 2000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete?.();
      setIsVisible(false);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 bg-linear-to-br from-blue-50 via-white to-blue-50 z-90 flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Lab Tube Animation */}
        <div className="labtube-container">
          <svg width="113px" height="130px" viewBox="0 0 113 130" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <title>lab tube</title>
            <defs>
              <path id="path-1" d="M14.4082031,31.3984375 C9.72293899,39.6001428 0.03515625,53.1738281 0.03515625,53.1738281 L84.7187532,53.1738281 C84.7187532,53.1738281 71.0988921,34.6200593 65.1298828,24.6005859 C60.5721983,16.9501375 53.1386719,0.1640625 53.1386719,0.1640625 C53.1386719,0.1640625 45.0962003,3.72763448 41,4.66796875 C36.7540779,5.64267354 28.1123047,5.90917969 28.1123047,5.90917969 C28.1123047,5.90917969 18.5933817,24.072148 14.4082031,31.3984375 Z"></path>
            </defs>
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="lab-tube">
                <g id="bottle" transform="translate(3.000000, 1.000000)" stroke="#676767" strokeWidth="4">
                  <path d="M15.3528948,92.0587001 C18.6470117,87.2041837 22.9833134,80.8138073 22.9833134,80.8138073 C29.1873947,71.6708973 34.2167964,55.3092415 34.2167964,44.2567326 L34.2167964,11.5 C34.2167964,12.6482199 69.8437489,11.5 69.8437489,11.5 L69.8437489,44.2567326 C69.8437489,55.3037375 75.0279506,71.5556847 81.4230175,80.5565149 L101.420731,108.702589 C107.815785,117.703401 104.054067,125 92.9991348,125 L13.0008652,125 C1.95469235,125 -1.96660662,117.582324 4.23056685,108.449595 L15.3528948,92.0587001 Z" id="Rectangle-1"></path>
                  <path d="M30,6.49197735 C30,2.90655726 32.903979,-3.04661916e-15 36.4923515,-2.93570394e-15 L67.5076485,-1.97703295e-15 C71.0932752,-1.86620259e-15 74,2.90993658 74,6.49197735 L74,8.50802265 C74,12.0934427 71.096021,15 67.5076485,15 L36.4923515,15 C32.9067248,15 30,12.0900634 30,8.50802265 L30,6.49197735 Z" id="Rectangle-2"></path>
                </g>
                <g id="allbubbles" transform="translate(14.000000, 63.000000)">
                  <mask id="mask-2" fill="white">
                    <use xlinkHref="#path-1"></use>
                  </mask>
                  <use id="Mask" fill="#3B82F6" xlinkHref="#path-1"></use>
                  <g mask="url(#mask-2)">
                    <g transform="translate(10.000000, 7.000000)">
                      <g id="bubblesfull" transform="translate(0.000000, 7.000000)">
                        <circle id="Oval-1" fill="#FFFFFF" cx="4" cy="32" r="4"></circle>
                        <circle id="Oval-1" fill="#FFFFFF" cx="41" cy="9" r="4"></circle>
                        <circle id="Oval-1" fill="#FFFFFF" cx="20.5" cy="30.5" r="2.5"></circle>
                        <circle id="Oval-1" fill="#FFFFFF" cx="25.5" cy="2.5" r="2.5"></circle>
                      </g>
                      <g id="bubblestransparent" transform="translate(34.370117, 23.224609) rotate(-270.000000) translate(-34.370117, -23.224609) translate(11.870117, 5.224609)" opacity="0.599999964">
                        <circle id="Oval-1" fill="#FFFFFF" cx="4" cy="32" r="4"></circle>
                        <circle id="Oval-1" fill="#FFFFFF" cx="41" cy="9" r="4"></circle>
                        <circle id="Oval-1" fill="#FFFFFF" cx="20.5" cy="30.5" r="2.5"></circle>
                        <circle id="Oval-1" fill="#FFFFFF" cx="25.5" cy="2.5" r="2.5"></circle>
                      </g>
                    </g>
                  </g>
                </g>
                <path d="M39.5,25 L50,25" id="Line" stroke="#686868" strokeWidth="2" strokeLinecap="square" opacity="0.300000012"></path>
                <path d="M39.5,39 L50,39" id="Line" stroke="#686868" strokeWidth="2" strokeLinecap="square" opacity="0.300000012"></path>
                <path d="M39.5,53 L50,53" id="Line" stroke="#686868" strokeWidth="2" strokeLinecap="square" opacity="0.300000012"></path>
                <path d="M39.5,46 L46,46" id="Line" stroke="#686868" strokeWidth="2" strokeLinecap="square" opacity="0.300000012"></path>
                <path d="M39.5,32 L46,32" id="Line" stroke="#686868" strokeWidth="2" strokeLinecap="square" opacity="0.300000012"></path>
              </g>
            </g>
          </svg>
        </div>

        <div>
            <h1 className="text-2xl text-gray-800">HPLC Simulator</h1>
        </div>
      </div>

      <style>{`
        .labtube-container #bubblesfull {
          animation: bubbleup 2s infinite;
          animation-timing-function: linear;
          opacity: 0;
        }

        .labtube-container #bubblestransparent {
          animation: bubbleup 3s infinite;
          animation-timing-function: linear;
          opacity: 0;
        }

        @keyframes bubbleup {
          from {
            transform: translate(25px, 200px);
          }
          to {
            transform: translate(25px, -100px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
