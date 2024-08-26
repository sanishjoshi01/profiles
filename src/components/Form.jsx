import Button from "./Button";
import axios from "axios";
import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";

const Form = ({ onClose, addFormData, selectedData }) => {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);

  const [selectedCountry, setSelectedCountry] = useState("Nepal");

  // Form data states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("Province 1"); // Default to Province 1
  const [profile, setProfile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    if (selectedData) {
      // Populate form fields if editing
      setName(selectedData.name || "");
      setEmail(selectedData.email || "");
      setPhoneNumber(selectedData.phoneNumber || "");
      setDob(selectedData.dob || "");
      setCity(selectedData.city || "");
      setDistrict(selectedData.district || "");
      setProvince(
        selectedData.country === "Nepal"
          ? selectedData.province || "Province 1"
          : ""
      );
      setSelectedCountry(selectedData.country || "Nepal");
      setProfile(selectedData.profile || null);
    }
  }, [selectedData]);

  const handleProfileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type !== "image/png") {
      setFileError("Only PNG images are allowed.");
    } else {
      setFileError("");

      try {
        // Options for compression
        const options = {
          maxSizeMB: 0.02,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };
        setUploadLoading(true);

        // Compress the image
        const compressedFile = await imageCompression(file, options);

        // Convert to Base64 string
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          setProfile(base64data);
          setUploadLoading(false);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing the image:", error);
      }
    }
  };

  const handleRemoveProfile = () => {
    setProfile(null);
  };

  const nepalProvinces = [
    "Province 1",
    "Madhesh Pradesh",
    "Bagmati Province",
    "Gandaki",
    "Lumbini",
    "Karnali",
    "Sudurpaschim",
  ];

  useEffect(() => {
    setLoading(true);
    const getCountriesData = () => {
      axios
        .get("https://restcountries.com/v3.1/all")
        .then((response) => {
          setCountries(response.data);
          setLoading(false);
          setError(null);
        })
        .catch((error) => {
          setLoading(false);
          setError(error);
        });
    };

    getCountriesData();
  }, []);

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);

    // Reset province if the selected country is not Nepal
    if (country !== "Nepal") {
      setProvince("");
    } else {
      setProvince("Province 1"); // Default to Province 1 when Nepal is selected
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    setNameError("");
    setEmailError("");
    setPhoneNumberError("");

    let hasError = false;
    if (!name) {
      setNameError("Name is required.");
      hasError = true;
    }
    if (!email) {
      setEmailError("Email is required.");
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Invalid email address.");
        hasError = true;
      }
    }
    if (!phoneNumber) {
      setPhoneNumberError("Phone Number is required.");
      hasError = true;
    } else {
      if (phoneNumber.length <= 7) {
        setPhoneNumberError(
          "Phone number must be equal to or greater than 8 digits!"
        );
        hasError = true;
      }
    }
    if (hasError) {
      return;
    }

    // Prepare form data object
    const formData = {
      name,
      email,
      phoneNumber,
      dob,
      city,
      district,
      province,
      country: selectedCountry,
      profile,
    };

    // Call the addOrUpdateFormData function
    addFormData(formData, selectedData?.index);

    // Reset form fields
    setName("");
    setEmail("");
    setPhoneNumber("");
    setDob("");
    setCity("");
    setDistrict("");
    setProvince("Province 1");
    setSelectedCountry("Nepal");
    setProfile(null);

    // Close the form modal
    onClose();
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p className="text-red-500 text-xs">Error fetching data...</p>;
  }

  let renderedCountryCode = countries.map((country) => {
    if (country.name.common === selectedCountry) {
      const root = country.idd?.root || "";
      const suffix = country.idd?.suffixes?.[0] || "";

      return (
        <span key={country.cca3}>
          ({root}
          {suffix})
        </span>
      );
    }
    return null;
  });

  let renderedFlags = countries.map((country) => {
    if (country.name.common === selectedCountry) {
      return (
        <img
          key={country.cca3}
          src={country.flags.svg}
          alt="country flag"
          className="aspect-[4/3] w-6"
        />
      );
    }
    return null;
  });

  let renderedOptions = countries.map((country) => {
    return (
      <option key={country.cca3} value={country.name.common}>
        {country.name.common}
      </option>
    );
  });

  return (
    <>
      <div className="fixed inset-0 bg-gray-300 opacity-80"></div>
      <div className="rounded-lg bg-gray-100 fixed inset-0 mx-20 md:mx-40 my-20 overflow-y-auto">
        <form className="p-6 " onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-3 mb-6">
            {/* Profile picture */}
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-2 ">
              {profile ? (
                <div className="relative">
                  <img
                    src={profile}
                    alt="Uploaded Profile"
                    className="w-32 md:w-44 h-16 md:h-36 object-cover bg-center border border-gray-200 rounded-lg"
                  />
                  <button
                    onClick={handleRemoveProfile}
                    className="absolute left-1 top-1 text-xs bg-red-500 rounded-sm text-white px-2 py-1 leading-none hover:bg-red-600 hover:text-black border-none"
                  >
                    x
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="profile-upload"
                  className="flex flex-col justify-center items-center w-32 md:w-44 h-16 md:h-36 bg-gray-200 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
                >
                  {uploadLoading ? (
                    <p className="text-xs">Uploading...</p>
                  ) : (
                    <div className="text-gray-400">
                      <span className="text-xs md:text-xl">+</span>
                      <span className="text-xs md:text-sm">
                        Add Your Profile
                      </span>
                    </div>
                  )}
                  <input
                    id="profile-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfileChange}
                  />
                </label>
              )}
              {fileError && (
                <p className="text-red-500 text-xs mt-2">{fileError}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            {/* Name field */}
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="name"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                className="appearance-none block w-full text-xs bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="name"
                type="text"
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              {nameError && (
                <p className="text-red-500 text-xs mt-2">{nameError}</p>
              )}
            </div>

            {/* Email field */}
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="email"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                className="appearance-none block w-full text-xs bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="email"
                type="email"
                placeholder="email@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-2">{emailError}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
            {/* Phone number field */}
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="phone-number"
              >
                Phone Number <span className="text-red-500">*</span>{" "}
                {renderedCountryCode}
              </label>
              <input
                className="appearance-none block w-full text-xs bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="phone-number"
                type="number"
                placeholder="##########"
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
              />
              {phoneNumberError && (
                <p className="text-red-500 text-xs mt-2">{phoneNumberError}</p>
              )}
            </div>

            {/* Date of birth field */}
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="dob"
              >
                Date of Birth (A.D)
              </label>
              <input
                className="appearance-none block w-full text-xs bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="dob"
                type="date"
                onChange={(e) => setDob(e.target.value)}
                value={dob}
              />
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
            {/* City field */}
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="city"
              >
                City
              </label>
              <input
                className="appearance-none block w-full text-xs bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="city"
                type="text"
                placeholder="Kathmandu"
                onChange={(e) => setCity(e.target.value)}
                value={city}
              />
            </div>

            {/* District field */}
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="district"
              >
                District
              </label>
              <input
                className="appearance-none block w-full text-xs bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="district"
                type="text"
                placeholder="Kathmandu"
                onChange={(e) => setDistrict(e.target.value)}
                value={district}
              />
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
            {/* Country field */}
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="flex items-center gap-1 mb-2" htmlFor="country">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                  Country
                </p>
                <span>{renderedFlags}</span>
              </label>
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  className="block appearance-none w-full text-xs bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="country"
                >
                  {renderedOptions}
                </select>
                {/* Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Province field */}
            {selectedCountry === "Nepal" && (
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="province"
                >
                  Province
                </label>
                <div className="relative">
                  <select
                    className="block appearance-none w-full text-xs bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="province"
                    onChange={(e) => setProvince(e.target.value)}
                    value={province}
                  >
                    {nepalProvinces.map((province, index) => (
                      <option key={index} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                  {/* Arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions Buttons */}
          <div className="flex items-center gap-2">
            <Button success className="rounded-md text-xs hover:bg-green-600">
              {selectedData ? "Update" : "Save"}
            </Button>
            <Button
              onClick={onClose}
              danger
              className="rounded-md text-xs hover:bg-red-600"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Form;
