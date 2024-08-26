import { Link } from "react-router-dom";
import Form from "../components/Form.jsx";
import { useState, useEffect } from "react";
import Table from "../components/Table.jsx";
import Button from "../components/Button.jsx";

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [formDataList, setFormDataList] = useState([]);
  const [selectedData, setSelectedData] = useState(null); // State to hold the data to be edited

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("formData")) || [];
    setFormDataList(storedData);
  }, []);

  const addOrUpdateFormData = (formData, index = null) => {
    if (index !== null) {
      // Update existing data
      const updatedData = [...formDataList];
      updatedData[index] = formData;
      setFormDataList(updatedData);
      localStorage.setItem("formData", JSON.stringify(updatedData));
    } else {
      // Add new data
      const updatedData = [...formDataList, formData];
      setFormDataList(updatedData);
      localStorage.setItem("formData", JSON.stringify(updatedData));
    }
  };

  const handleEdit = (index) => {
    setSelectedData({ ...formDataList[index], index });
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedData(null); // Clear selected data when closing the form
  };

  return (
    <div className="max-w-4xl p-4 mx-auto">
      {showForm && (
        <Form
          onClose={handleClose}
          addFormData={addOrUpdateFormData}
          selectedData={selectedData}
        />
      )}

      <Link to="/profiles" formDataList={formDataList}>
        Go to profiles
      </Link>

      <Button
        primary
        className="rounded-md my-3 hover:bg-blue-700"
        onClick={() => setShowForm(true)}
      >
        Add Record
      </Button>
      <Table
        formDataList={formDataList}
        setFormDataList={setFormDataList}
        onEdit={handleEdit} // Pass the edit handler to the table
      />
    </div>
  );
};

export default Home;
