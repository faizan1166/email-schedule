import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { TiPencil } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ApiData {
  _id: string;
  title: string;
  description: string;
  subject: string;
  frequency: string;
  repeat: string;
  time: string;
  __v: number;
}

interface FormData {
  title: string;
  description: string;
  subject: string;
  frequency: string;
  repeat: string;
  time: string;
}

function TableComponent() {
  const rowsPerPage = 10;
  const editID = localStorage.getItem("uniqueID") ?? "";
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [apiData, setApiData] = useState<ApiData[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [modalMode, setModalMode] = useState<string>("add");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    subject: "",
    frequency: "",
    repeat: "",
    time: "",
  });

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setSearchTerm(value);
  };

  const handleSearchReset = (): void => {
    // Reset the search term and fetch all data
    setSearchTerm("");
    getEmails();
  };

  const handleSubmit = (): void => {
    axios
      .post(`${process.env.REACT_APP_EMAIL_SCHEDULES}`, formData)
      .then((response) => {
        console.log("API Response:", response.data);
        toast.success("Email Schedule Added Successfully");
        getEmails();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // const handleDayClick = (day: string): void => {
  //   setSelectedDay(day);
  // };
  const handleUpdate = (id: string) => {
    axios
      .patch(`${process.env.REACT_APP_EMAIL_SCHEDULES}/${id}`, formData)
      .then((response) => {
        toast.success("Update Successfully");
        getEmails();
        setFormData(() => ({
          title: "",
          description: "",
          subject: "",
          frequency: "",
          repeat: "",
          time: "",
        }));
        localStorage.removeItem("uniqueID");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getUniqueEmail = (id: string) => {
    axios
      .get(`${process.env.REACT_APP_EMAIL_SCHEDULES}/${id}`)
      .then((response) => {
        console.log(response);
        setFormData((prevData) => ({
          ...prevData,
          _id: response.data._id,
          title: response.data.title,
          description: response.data.description,
          subject: response.data.subject,
          frequency: response.data.frequency,
          repeat: response.data.repeat,
          time: response.data.time,
        }));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDelete = (id: string) => {
    axios
      .delete(`${process.env.REACT_APP_EMAIL_SCHEDULES}/${id}`)
      .then((response) => {
        toast.success("Deleted Successfully");
        getEmails();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getEmails = (): void => {
    fetch(`${process.env.REACT_APP_EMAIL_SCHEDULES}`)
      .then((response) => response.json())
      .then((data) => setApiData(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    getEmails();
  }, []);
  // useEffect(() => {
  //   getEmails();
  // }, [searchTerm===""]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = apiData.slice(indexOfFirstRow, indexOfLastRow);

  const renderTableRows = (): JSX.Element[] => {
    return currentRows.map((row) => (
      <tr key={row._id}>
        <th scope="row">{row.title}</th>
        <td>{row.description}</td>
        <td>{row.subject}</td>
        <td>
          {row.frequency.charAt(0).toUpperCase() + row.frequency.slice(1)} at{" "}
          {row.time}
        </td>
        <td>
          <TiPencil
            data-toggle="modal"
            data-target="#exampleModal"
            className="mr-1"
            style={{ cursor: "pointer" }}
            onClick={() => {
              localStorage.setItem("uniqueID", row?._id);
              setModalMode("edit");
              getUniqueEmail(row._id);
            }}
          />
          <MdDelete
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleDelete(row._id);
            }}
          />
        </td>
      </tr>
    ));
  };

  const renderPagination = (): JSX.Element => {
    const pageNumbers = Math.ceil(apiData.length / rowsPerPage);

    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-end">
          {Array.from({ length: pageNumbers }, (_, index) => (
            <li
              key={index + 1}
              className={`page-item ${currentPage === index + 1 ? "active" : ""
                }`}
            >
              <a
                className="page-link"
                href="#"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  const handleSearch = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const searchTermValue = e.target.value.trim();
    setSearchTerm(searchTermValue);

    if (searchTermValue !== "") {
      axios
        .get(
          `${process.env.REACT_APP_EMAIL_SCHEDULES}?search=${searchTermValue}`
        )
        .then((response) => {
          setApiData(response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (searchTermValue === "") {
      // If the search term is empty, fetch all data
      getEmails();
    }
  };

  return (
    <>
      <div className="d-flex align-items-center mb-3 justify-content-between">
        <form className="nosubmit">
          <input
            className="nosubmit"
            type="search"
            placeholder="Search"
            onChange={(e) => {
              handleSearch(e);
            }}
          />
        </form>
        <button
          data-toggle="modal"
          data-target="#exampleModal"
          type="button"
          style={{ backgroundColor: "#391E5A" }}
          className="btn btn-primary btn-sm align-items-center d-flex border-0"
          onClick={() => {
            setModalMode("add");
          }}
        >
          <IoIosAddCircleOutline
            style={{ marginRight: "5px", fontSize: "16px" }}
          />
          Add
        </button>
      </div>
      <div className="table-wrapper">
        <table className="table bg-white">
          <thead className="" style={{ backgroundColor: "#D8D2DE" }}>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Subject</th>
              <th scope="col">Schedule</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>{renderTableRows()}</tbody>
        </table>
        {renderPagination()}
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add Schedule
              </h5>
            </div>
            <div className="modal-body">
              <form>
                <form>
                  <div className="form-group row d-flex justify-content-between">
                    <label
                      htmlFor="inputTitle"
                      className="col-sm-2 col-form-label"
                    >
                      Title
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        id="inputTitle"
                        placeholder="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row d-flex justify-content-between">
                    <label
                      htmlFor="inputDescription"
                      className="col-sm-2 col-form-label"
                    >
                      Description
                    </label>
                    <div className="col-sm-9">
                      <textarea
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        rows={2}
                        placeholder="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                  </div>
                  <div className="form-group row d-flex justify-content-between">
                    <label
                      htmlFor="inputSubject"
                      className="col-sm-2 col-form-label"
                    >
                      Subject
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        id="inputSubject"
                        placeholder="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row d-flex justify-content-between">
                    <label
                      htmlFor="inputFrequency"
                      className="col-sm-2 col-form-label"
                    >
                      Frequency
                    </label>
                    <div className="col-sm-9">
                      <select
                        className="form-control"
                        id="inputFrequency"
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleInputChange}
                      >
                        <option>-----</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="daily">Daily</option>
                      </select>
                    </div>
                  </div>
                  {formData?.repeat !== "daily" ? (
                    <div className="form-group row d-flex justify-content-between">
                      {formData?.repeat !== "daily" ? (
                        <label
                          htmlFor="inputRepeat"
                          className="col-sm-2 col-form-label"
                        >
                          Repeat
                        </label>
                      ) : null}
                      <div className="col-sm-9">
                        {formData.frequency === "weekly" ? (
                          <div className="weekday-selector m-0">
                            {daysOfWeek.map((day, index) => (
                              <div
                                key={index}
                                className={`weekday ${selectedDay === day ? "selected" : ""
                                  } `}
                                // value={formData.repeat}
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    repeat: day,
                                  });
                                  setSelectedDay(day);
                                }}
                              >
                                {day.slice(0, 1)}
                              </div>
                            ))}
                          </div>
                        ) : formData.frequency === "monthly" ? (
                          <select
                            className="form-control"
                            id="inputRepeat"
                            name="repeat"
                            value={formData.repeat}
                            onChange={handleInputChange}
                          >
                            <option>Select</option>
                            <option value="first monday">First Monday</option>
                            <option value="last friday">Last Friday</option>
                          </select>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                  <div className="form-group row d-flex justify-content-between">
                    <label
                      htmlFor="inputTime"
                      className="col-sm-2 col-form-label"
                    >
                      Time
                    </label>
                    <div className="col-sm-9">
                      <select
                        className="form-control"
                        id="inputTime"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                      >
                        <option>-----</option>
                        <option>1:00 AM</option>
                        <option>2:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>12:00 AM</option>
                      </select>
                    </div>
                  </div>
                </form>{" "}
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm border-0"
                data-dismiss="modal"
                style={{ backgroundColor: "#391E5A" }}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  modalMode === "add" ? handleSubmit() : handleUpdate(editID)
                }
              >
                {modalMode === "add" ? "Done" : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default TableComponent;
