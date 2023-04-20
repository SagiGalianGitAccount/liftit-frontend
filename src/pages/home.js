import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../static/css/home.css";
import AddMuscle from "../components/addmuscle";
import Muscle from "../components/muscle";
import axios from "axios";
import { backendUrl } from "../components/urlConnector";
import Nav from "../components/nav";
import { VscAdd } from "react-icons/vsc";
import { FcSearch } from "react-icons/fc";
import Loader from "../components/loader";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function startWithStr(string, substring) {
  if (substring.length > string.length) return false;

  for (let i = 0; i < substring.length; i++) {
    if (string[i].toLowerCase() != substring[i].toLowerCase()) return false;
  }
  return true;
}

function Home() {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [muscles, setMuscles] = useState([]);
  const [nextMuscleId, setNextMuscleId] = useState(0);
  const [filteredMuscles, setFilteredMuscles] = useState([]);
  const [searching, setSearching] = useState(false);
  const [inspecting, setInspecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expired, setExpired] = useState(false);
  const [freeTrial, setFreeTrial] = useState(false);

  useEffect(() => {
    setFilteredMuscles(muscles);
  }, [muscles]);

  useEffect(() => {
    if (!localStorage.getItem("id")) {
      navigate("/login");
    } else {
      setLoading(true);
      axios
        .get(backendUrl + "getAccountDetails", {
          params: {
            accountId: localStorage.getItem("id"),
          },
        })
        .then((result) => {
          if (!result.data.premium) {
            console.log("This is a regular account");
            //Checking expiration HERE:

            const creationDate = new Date(result.data.date);

            if (result.data.inTrial) {
              console.log("You are in Trial, Did it expired ?")
              const currentDate = new Date();
              setFreeTrial(true);
              if (isNaN(creationDate.getTime())) {
                console.log("Invalid Date");
                setExpired(true);
              } else {
                if (currentDate - creationDate >= 604800000) {
                  // The number is a weak in miliseconds
                  setExpired(true);
                  console.log("Your free Trial (7 days) has been expired");
                } else {
                  setExpired(false);
                  console.log("Account has not been expired yet.");
                }
              }
              console.log(
                `Time passed sense the Creation Date `,
                (currentDate - creationDate) / 86400000 /*convert to days*/,
                "days"
              );
            } else {
              // not in trial HERE
              console.log("You are not in Trial")
              const currentDate = new Date();
              if (isNaN(creationDate.getTime())) {
                console.log("Invalid Date");
                setExpired(true);
              } else {
                const currentDate = new Date();
                if (currentDate - creationDate >= 2592000000) {
                  // The number is a month in miliseconds
                  setExpired(true);
                  console.log("Account has been expired.");
                } else {
                  setExpired(false);
                  console.log("Account has not been expired yet.");
                }
                console.log(
                  `Time passed sense the Creation Date `,
                  (currentDate - creationDate) / 86400000 /*convert to days*/,
                  "days"
                );
              }
            }
          } else {
            console.log("This is a premium Account");
          }
          localStorage.setItem("accountName", result.data.name);
          setMuscles(result.data.muscles);
          setNextMuscleId(
            result.data.muscles.length > 0
              ? result.data.muscles[result.data.muscles.length - 1].muscleId + 1
              : 0
          );
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const activeAccount = () => {
    axios.post(backendUrl + 'activeAccount', null, {
      params: {
        accountId: localStorage.getItem('id'),
      }
    }).then(result => {
      console.log(result)
    })
  }
  const changeFreeTrialToFalse = () => {
    axios
      .post(backendUrl + "changeFreeTrial", null, {
        params: {
          accountId: localStorage.getItem("id"),
        },
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const addMuscleLocaly = (muscleName) => {
    setMuscles((current) => [
      ...current,
      {
        muscleId: nextMuscleId,
        muscleName: muscleName,
        muscleExercises: [],
      },
    ]);
  };
  const removeMuscle = (muscleId) => {
    axios
      .post(backendUrl + "removeMuscle", null, {
        params: {
          accountId: localStorage.getItem("id"),
          muscleId: muscleId,
        },
      })
      .then((result) => {
        console.log(result.data + "{on db side}");
      });
    setMuscles((currnet) =>
      currnet.filter((muscle) => muscle.muscleId !== muscleId)
    );
  };
  const renameMuscleLocaly = (muscleId, newName) => {
    const newMuscles = muscles.map(item => {
      if (item.muscleId === muscleId) {
        return { ...item, muscleName: newName };
      }
      return item;
    });

    setMuscles(newMuscles);
  }
  return (
    <>
      {!expired ? ( 
        <div className="home-container">
          <Nav />
          {!adding && !inspecting && (
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 20,
                }}
              >
                <h1>Muscles Page ({filteredMuscles.length})</h1>
                <div className="buttons-home">
                  <FcSearch
                    size={35}
                    style={{
                      border: "2px solid black",
                      padding: 5,
                      borderRadius: 28,
                      marginRight: 3,
                    }}
                    onClick={() => {
                      if (searching) {
                        setFilteredMuscles(muscles);
                      }
                      setSearching((current) => !current);
                    }}
                  />
                  <VscAdd
                    onClick={() => {
                      setAdding((current) => !current);
                    }}
                    size={35}
                    color="#3f6ce1"
                    style={{
                      border: "2px solid #3f6ce1",
                      padding: 5,
                      borderRadius: 28,
                    }}
                  />
                </div>
              </div>
              {searching && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: 10,
                  }}
                >
                  <input
                    placeholder="Search for a muscle"
                    className="form-control"
                    style={{ width: "95%" }}
                    onChange={(e) => {
                      setFilteredMuscles(
                        muscles.filter((m) =>
                          startWithStr(m.muscleName, e.target.value)
                        )
                      );
                    }}
                  />
                </div>
              )}
            </div>
          )}

          <br />
          {!adding ? (
            <div id="scroller">
              {filteredMuscles.length > 0 ? (
                <div>
                  {filteredMuscles.map((muscle) => (
                    <Muscle
                    renameMuscleLocaly={renameMuscleLocaly}
                      setInspecting={setInspecting}//
                      key={muscle.muscleId}
                      removeMe={removeMuscle}
                      muscleId={muscle.muscleId}
                      name={muscle.muscleName}
                      muscleExercises={muscle.muscleExercises}
                    ></Muscle>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: 10 }}>
                  <h2>There are 0 muscles</h2>
                </div>
              )}
            </div>
          ) : (
            <AddMuscle
              setAdding={setAdding}
              nextMuscleId={nextMuscleId}
              setNextMuscleId={setNextMuscleId}
              addMuscleLocaly={addMuscleLocaly}
            />
          )}
          {loading && <Loader />}
        </div>
      ) : (
        <div style={{padding: 20}}>
          <button
            className="btn btn-danger m-2"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Log out
          </button>
          <br />
          <br />
          <br />
          <h1>Your session has expired, Pay Here to active your account</h1>
          <br />
          <PayPalScriptProvider
            options={{
              "client-id": process.env.REACT_APP_LIVEMODE_PAYMENT, // 3 when doing subscription, none when doing one time punchase
              currency: "ILS",
              // vault: true, //same us one below
              // intent:'subscription', // unable while doing one time punchase
            }}
          >
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: "20.00",
                      },
                    },
                  ],
                });
              }}
              onApprove={(data, actions) => {
                console.log("approved");
                if (freeTrial) {
                  changeFreeTrialToFalse(); // will change the date to the current + will change inTrial field to false
                } else {
                  activeAccount() // will change the date to the current
                }
                setExpired(false);
              }}
            />
          </PayPalScriptProvider>
        </div>
      )}
    </>
  );
}

export default Home;
