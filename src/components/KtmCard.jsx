import React, { useEffect, useRef } from "react";
import { downloadKtm } from "../utils/downloadKtm";

const KtmCard = ({ student, onClose }) => {
  const cardRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!student) return null;

  const getImageUrl = (path) => {
    if (!path) return "";
    return `http://localhost:8080${path}`;
  };

  const handleDownload = () => {
    downloadKtm("ktm-card", student.name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={cardRef} className="relative">
        <div id="ktm-card" className="frame-parent max-h-[500px] ">
          <div className="relative bg-[#753995] rounded-3xl w-[800px] h-[50px]">
            <div className="relative h-full">
              <div className="absolute top-1 left-0 rounded-3xl bg-gradient-to-b from-[#fae303] to-transparent w-[800px] h-[210px]" />

              <div className="relative">
                <div className="flex justify-between pt-8 px-8">
                  <img src="/chip.png" alt="Chip" className="h-14" />
                  <img src="/logo-ug.png" alt="UG Logo" className="h-32" />
                </div>

                <div className="flex px-8 pt-4 mb-8 gap-6 items-center">
                  <img
                    src={getImageUrl(student.photo_url)}
                    alt={student.name}
                    className="w-[150px] max-w-[150px] h-[200px] max-h-[200px] rounded-xl object-cover"
                  />
                  <div className=" text-white font-semibold text-xl">
                    <div>{student.nim}</div>
                    <div>{student.name}</div>
                    <div>{student.major}</div>
                    <div>{student.faculty}</div>
                  </div>
                  <div className="ml-auto flex items-center gap-2 mr-9">
                    <span className="text-3xl  text-white">prepaid</span>
                    <img src="/chip-symbol.png" alt="Symbol" className="h-11" />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex flex-col items-end justify-start w-[360px] gap-1.5  ">
                    <div className="flex items-center mt-8 w-full text-xl tracking-[-1px] leading-[18px] -mr-5">
                      <span>
                        <span>
                          <span className="text-purple-950 text-2xl">U</span>
                          <span className="text-[#f47820] text-2xl">G</span>
                        </span>
                        <span> </span>
                        <span className="text-black">
                          <span className="text-[#592971]">CO</span>
                          <span className="text-[#ee2824]">LO</span>
                          <span className="text-[#fae303]">RING</span>
                          <span className="text-blue-950">
                            {" "}
                            THEGLOBAL FUTURE
                          </span>
                        </span>
                      </span>
                    </div>
                    <div className="relative w-full h-[5px] flex items-center">
                      <div className="absolute top-0 left-0 w-full h-full bg-[#fae303]"></div>
                      <div className="absolute top-0 left-0 w-[240px] h-full bg-[#ee2824]"></div>
                      <div className="absolute top-0 left-0 w-[120px] h-full bg-[#592971]"></div>
                    </div>
                  </div>

                  <div className="w-40 mr-10">
                    <img src="./barcode.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KtmCard;
