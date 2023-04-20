import React, { Component, useEffect, useState } from "react";
import "../static/css/nav.css"; //
import { RiMore2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoMdDoneAll } from "react-icons/io";
import { FcAssistant, FcInfo } from "react-icons/fc";
import { VscBellDot, VscBell } from "react-icons/vsc";
import { FaWindowClose } from "react-icons/fa";
import Contact from "../pages/contact";
import Explanation from "../pages/explanation";
import axios from "axios";
import { backendUrl } from "./urlConnector";
import PropagateLoader from "react-spinners/PropagateLoader";

function Nav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [contacting, setContacting] = useState(false);
  const [explanation, setExplanation] = useState(false);
  const [inUpdates, setInUpdates] = useState(false);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    getUpdates();
  }, []);
  const getUpdates = () => {
    axios
      .get(backendUrl + "getUpdates")
      .then((result) => {
        setUpdates(result.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div>
      <div
        id="scroller"
        className="nav"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div
            onClick={() => {
              setInUpdates((current) => !current);

              // axios
              //   .get(backendUrl + "changeNotified", {
              //     params: {
              //       accountId: localStorage.getItem("id"),
              //     },
              //   })
              //   .then((result) => {
              //     console.log(result);
              //   })
              //   .catch((err) => {
              //     console.error(err);
              //   });
            }}
            style={{ marginLeft: 10 }}
          >
            <VscBellDot
              size={30}
              onClick={() => {
                localStorage.setItem("notified", true);
              }}
            />
          </div>
          <div id="scroller">
            <h1 style={{ marginLeft: 25 }}>
              {localStorage.getItem("accountName")}
            </h1>
          </div>
        </div>
        <RiMore2Fill
          size={30}
          onClick={() => {
            setOpen((current) => !current);
          }}
        />
      </div>
      {/* {open && (
        <div className="nav-btns">
          <RiLogoutBoxRLine
            style={{
              border: "2px solid #d8315b",
              padding: 5,
              borderRadius: 28,
              marginRight: 3,
            }}
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            color="#d8315b"
            size={40}
          />
          <FcAssistant
            style={{
              border: "2px solid orange",
              padding: 5,
              borderRadius: 28,
              marginRight: 3,
            }}
            onClick={() => {
              setContacting(true);
            }}
            size={40}
          />
          <FcInfo
            style={{
              border: "2px solid #3f6ce1",
              padding: 5,
              borderRadius: 28,
              marginRight: 3,
            }}
            onClick={() => {
              setExplanation(true);
            }}
            size={40}
          />
        </div>
      )} */}
      {contacting && <Contact setContacting={setContacting} />}
      {explanation && <Explanation setExplanation={setExplanation} />}
      {inUpdates && (
        <div className="inupdate">
          {updates.map((update) => (
            <h1 key={update} style={{ fontSize: 22 }}>
              {update}
            </h1>
          ))}

          <IoMdDoneAll
            className="editicon"
            size={30}
            color="green"
            onClick={() => {
              setInUpdates((current) => !current);
            }}
          />
        </div>
      )}
      {open && (
        <div className={`sidebar ${open ? "open" : ""}`}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PropagateLoader size={10} />
          </div>
          <div className="nav-btns">
            <div
              className="inline-div-button-title"
              onClick={() => {
                setOpen(false);
                localStorage.clear();
                navigate("/login");
              }}
            >
              <RiLogoutBoxRLine
                style={{
                  border: "2px solid #d8315b",
                  padding: 5,
                  borderRadius: 28,
                  marginRight: 10,
                }}
                color="#d8315b"
                size={40}
              />
              <h6>Log Out</h6>
            </div>
            <div
              className="inline-div-button-title"
              onClick={() => {
                setContacting(true);
                setOpen(false);
              }}
            >
              <FcAssistant
                style={{
                  border: "2px solid orange",
                  padding: 5,
                  borderRadius: 28,
                  marginRight: 10,
                }}
                size={40}
              />
              <h6>Contact Us</h6>
            </div>
            <div
              className="inline-div-button-title"
              onClick={() => {
                setExplanation(true);
                setOpen(false);
              }}
            >
              <FcInfo
                style={{
                  border: "2px solid #fffaff",
                  padding: 5,
                  borderRadius: 28,
                  marginRight: 10,
                }}
                size={40}
              />
              <h6>Information Page</h6>
            </div>
            <div
              className="inline-div-button-title"
              onClick={() => {
                setOpen(false);
              }}
            >
              <FaWindowClose
                color="gray"
                style={{
                  border: "2px solid gray",
                  padding: 5,
                  borderRadius: 28,
                  marginRight: 10,
                }}
                size={40}
              />
              <h6>Close</h6>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <PropagateLoader size={10} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Nav;
