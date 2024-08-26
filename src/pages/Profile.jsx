import { useState, useEffect } from "react";
import { IoPersonCircle } from "react-icons/io5";
import { Link } from "react-router-dom";

const Profile = () => {
  const [formDataList, setFormDataList] = useState([]);
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("formData")) || [];
    setFormDataList(storedData);
  }, []);

  return (
    <div className="max-w-4xl p-4 mx-auto">
      <Link to="/" formDataList={formDataList}>
        Go back
      </Link>
      <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Profile
            </th>
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
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {formDataList.map((data, index) => (
            <tr key={index}>
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
                <div className="text-xs font-medium text-gray-900">
                  {data.name}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-xs text-gray-900">{data.phoneNumber}</div>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
