import React, { useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ExpenseLog(props) {
  const x = localStorage.getItem("jwt_token");
  let navigate = useNavigate();

  const [showOp, setShowOp] = useState({
    id: "",
    status: false,
  });

  const [detail, setDetail] = useState({});

  const handleDetail = (event, exp) => {
    console.log(exp);
    axios({
      method: "get",
      url: `/detailedexpense/${exp._id}`,
      headers: {
        Authorization: `Bearer ${x}`,
      },
    })
      .then((response) => {
        setDetail(response.data);
        console.log("detail", response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          console.log("unauth");
          navigate(`/signin`);
        }
      });
  };

  const handleDelete = (event, exp) => {
    console.log(exp);
    axios({
      method: "delete",
      url: `/deleteexpense/${exp._id}`,
      headers: {
        Authorization: `Bearer ${x}`,
      },
    })
      .then((response) => {
        console.log("done");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          console.log("unauth");
          navigate(`/signin`);
        }
      });
  };

  // const handleEdit = (event, exp) => {
  //   console.log(exp);

  // };

  const [editMode, setEditMode] = useState({
    details:{},
    status: false,
  });
  const [editAmount, setEditAmount] = useState(false);
  const [editPurpose, setEditPurpose] = useState(false);
  const [purpose, setPurpose] = useState(" ");
  const [amount, setAmount] = useState( );

  const [editedData, setEditedData] = useState({
    pupose: editMode.purpose,
    amount: editMode.amount,
    splitInto: [],
  });

  return (
    <div className="border-2  my-24 mx-32 rounded-t-xl bg-white" id="tranbg">
      {!editMode.status && (
        <>
          <div className="p-4 bg-[#E18A07] rounded-t-xl">
            <h2 className="text-center">Previous Transaction</h2>
          </div>
          <div className="mt-6">
            {props.all
              .filter((name, idx) => {
                return props.limit ? idx < 5 : name;
              })
              .map((names) => {
                return (
                  <>
                    <div className=" p-2 grid grid-cols-3 gap-4">
                      <div className="  text-center">{names.owner.name}</div>
                      <div className=" text-center">{names.purpose}</div>
                      <div className="text-center">
                        ₹{names.amount}
                        <button
                          className=""
                          // onClick={(event) => handleDelete(event, names)}
                          onClick={() => {
                            setShowOp({
                              id: `${names._id}`,
                              status: !showOp.status,
                            });
                            console.log("OP", showOp);
                          }}
                        >
                          <AiOutlineMore style={{ marginLeft: "20px" }} />
                        </button>
                        {showOp.status && showOp.id === names._id && (
                          <div className="flex flex-col">
                            <button
                              className="bg-black text-white"
                              // onClick={(event) => handleDelete(event, names)}
                              onClick={() =>
                                setEditMode({
                                  // name: names.owner.name,
                                  // purpose: names.purpose,
                                  // amount: names.amount,
                                  details: names,
                                  status: true,
                                })
                              }
                            >
                              Edit
                            </button>
                            <button
                              className="bg-black text-white"
                              onClick={(event) => handleDetail(event, names)}
                            >
                              Details
                            </button>
                            <button
                              className="bg-black text-white"
                              onClick={(event) => handleDelete(event, names)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <hr className="mx-16 " />
                  </>
                );
              })}
            <div className=" text-center">
              <button
                onClick={() => props.setLimit(!props.limit)}
                className=" border-[3px] rounded-[10px] border-black py-2 px-3"
              >
                {props.limit ? "Show more" : "Show less"}
              </button>
            </div>
          </div>
        </>
      )}
      {editMode.status && (
        <div className="mt-2">
          <div className="grid grid-cols-2 gap-36 p-2 ">
            <div className="flex flex-row">
              <span
                onClick={() => {
                  setEditPurpose(true);
                  setPurpose(editMode.details.purpose)
                }}
              >
                <MdOutlineEdit />
              </span>
              {!editPurpose && <div>{editMode.details.purpose}</div>}
              {editPurpose && (
                <input type="text" value={purpose} onChange={(e)=>{setPurpose(e.target.value)}}/>
              )}
            </div>
            <div className="flex flex-row">
              <span
                onClick={() => {
                  setEditAmount(true);
                  setAmount(editMode.details.amount)
                }}
              >
                <MdOutlineEdit />
              </span>
              <span>₹</span>
              {!editAmount && <div>{editMode.details.amount}</div>}
              {editAmount && (
                <input type="number" value={amount} onChange={(e)=>{setAmount(e.target.value)}} />
              )}
              <span
                className=" text-red-600 mx-10"
                onClick={() => {
                  setEditMode({
                    details: " ",
                    status: false,
                  });
                  setEditPurpose(false)
                  setEditAmount(false)
                  setPurpose(" ")
                  setAmount()
                  console.log("close", editedData);
                }}
              >
                x
              </span>
              <span
                onClick={() => {
                  let splitArr = []
                  editMode.details.splitInto.forEach((e)=>{splitArr.push(e.name)})
                  setEditedData({
                    purpose: editPurpose ? purpose : editMode.details.purpose,
                    amount: editAmount ? amount : editMode.details.amount,
                    splitInto: splitArr
                  })
                  console.log("done", editedData);
                }}
              >
                V
              </span>
            </div>
          </div>
          <div className=" text-[#02A9EA]">
            Split With &rarr;
            <div className=" flex flex-row">
              {editMode.details.splitInto.map((split) => {
                return (
                  <div className="px-4 py-2 m-2 bg-[#2176AE] text-white rounded-[15px] ">
                    {split.name}
                    <span className="text-white ml-4 font-thin ">x</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
