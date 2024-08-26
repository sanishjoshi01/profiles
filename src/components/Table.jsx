import { IoPersonCircle } from "react-icons/io5";
import { useState } from "react";

const Table = ({ formDataList, setFormDataList }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate the indices for slicing the formDataList
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = formDataList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(formDataList.length / itemsPerPage);

  const handleDelete = (indexToDelete) => {
    const updatedData = formDataList.filter(
      (_, index) => index !== indexToDelete
    );
    localStorage.setItem("formData", JSON.stringify(updatedData));
    setFormDataList(updatedData);
    if (currentPage > 1 && currentItems.length === 1) {
      setCurrentPage(currentPage - 1); // Go to previous page if the last item on the current page is deleted
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Phone Number
              </th>
              <th
                scope="col"
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date of Birth
              </th>
              <th
                scope="col"
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Address
              </th>
              <th
                scope="col"
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((data, index) => (
              <tr key={indexOfFirstItem + index}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {data.profile ? (
                        <img
                          src={data.profile}
                          alt="profile picture"
                          className="w-10 h-10 rounded-full border-red-100"
                        />
                      ) : (
                        <IoPersonCircle className="w-10 h-10 rounded-full border-red-100" />
                      )}
                    </div>

                    <div className="ml-4">
                      <div className="text-xs font-medium text-gray-900">
                        {data.name}
                      </div>
                      <div className="text-xs text-gray-500">{data.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-900">
                    {data.phoneNumber}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-900">{data.dob}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                  <div className="text-xs text-gray-900">{`${data.city}`}</div>
                  <div className="text-xs text-gray-900">{`${data.district}`}</div>
                  <div className="text-xs text-gray-900">{`${data.province}`}</div>
                  <div className="text-xs text-gray-900">{`${data.country}`}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <span
                    onClick={() => console.log("Edit functionality")}
                    className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                  >
                    Edit
                  </span>
                  <span
                    onClick={() => handleDelete(indexOfFirstItem + index)}
                    className="ml-2 text-red-600 hover:text-red-900 cursor-pointer"
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center  w-full mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default Table;
