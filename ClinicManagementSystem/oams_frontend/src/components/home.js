import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = ({}) => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/home/categories"
        );
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        } else {
          console.error("Failed to fetch specialization :", response.statusText);
        }
      } catch (error) {
        console.error("Failed to fetch specialization :", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/home/services");
        if (response.ok) {
          const data = await response.json();
          setServices(data.services);
        } else {
          console.error("Failed to fetch Doctors:", response.statusText);
        }
      } catch (error) {
        console.error("Failed to fetch Doctors:", error);
      }
    };

    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/home/services/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setServices(services.filter((service) => service._id !== id));
      } else {
        console.error("Failed to delete Doctor:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to delete Doctor:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter services based on search query
  const filteredServices = services.filter(
    (service) =>
      service.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.address.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.address.zip.includes(searchQuery) ||
      service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{
        background: "linear-gradient(to right, #A9f1df, #FFBBBB)",
        minHeight: "100vh",
        paddingLeft: "20px", paddingRight: "20px" 
      }}
    >
      <div className="home-container">
        <div
          className="heading-section"
          style={{
            background: "linear-gradient(to right, #A9f1df, #FFBBBB)",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
            textAlign: "left",
          }}
        >
          <h2 className="heading">Search Doctors</h2>
          <input
            type="text"
            placeholder="Enter Doctor Name, City, ZIP Code, or State"
            value={searchQuery}
            onChange={handleSearch}
            style={{
              width: "1000px",
              borderRadius: "50px",
              padding: "10px",
              borderColor: "whitesmoke",
            }}
          />
        </div>

        <div
          className="heading-section"
          style={{
            background: "linear-gradient(to right, #A9f1df, #FFBBBB)",
            padding: "20px",
            borderRadius: "50px",
            marginBottom: "20px",
            textAlign: "left",
            position: "relative",
          }}
        >
          <h2 className="heading">Specializations</h2>
          <div
            className="underline-square"
            style={{
              backgroundColor: "#ffffff",
              position: "absolute",
              bottom: "-5px",
              left: "20px",
              width: "95%",
              height: "5px",
            }}
          ></div>
        </div>
        <br></br>
        <div className="categories-container">
          <div className="category-grid">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${category._id}`}
                  className="view-button2"
                >
                  <div
                    key={category._id}
                    className="category-item"
                    style={{
                      backgroundImage: `url(${category.image})`,
                      color: "black",
                      width: "210px",
                      height: "150px",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    {/* <h4 className="category-title">{category.title}</h4> */}
                  </div>
                </Link>
              ))
            ) : (
              <p>No specialization  available.</p>
            )}
          </div>
        </div>
        <br></br>
        <div
          className="heading-section"
          style={{
            background: "linear-gradient(to right, #A9f1df, #FFBBBB)",
            padding: "20px",
            borderRadius: "50px",
            marginBottom: "20px",
            textAlign: "left",
            position: "relative",
          }}
        >
          <h2 className="heading">Doctors</h2>
          <div
            className="underline-square"
            style={{
              backgroundColor: "#ffffff",
              position: "absolute",
              bottom: "-5px",
              left: "20px",
              width: "95%",
              height: "5px",
            }}
          ></div>
        </div>
        <br></br>
        <div className="services-grid">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div key={service._id} className="service-item">
                <img
                  src={require(`../serviceImages/${service.image}`)}
                  alt="Service"
                  className="service-image"
                  style={{
                    width: "200px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />

                <br />
                <h4 className="service-title">{service.title}</h4>

                <br />
                <p className="service-description">
                  Description:{" "}
                  {service.description.length > 110
                    ? `${service.description.slice(0, 110)}...`
                    : service.description}
                </p>
                <p className="service-charges">Charges: {service.charges}</p>
                <p className="service-duration">Duration: {service.duration}</p>
                <div className="button-container">
                  <Link to={`/services/${service._id}`} className="view-button">
                    View Details
                  </Link>
                  {window.localStorage.getItem("UserId") === service.userId && (
                    <>
                      <Link
                        className="edit-button"
                        to={`/services/edit/${service._id}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(service._id)}
                        style={{
                          width: "75px",
                          height: "38px",
                          objectFit: "cover",
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No Doctors match the search criteria.</p>
          )}
        </div>
      </div>
      <br></br>
      <div
        style={{
          background: "black",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3> specialization </h3>
          <ul>
            {categories.slice(0, 5).map((category) => (
              <li key={category._id}>{category.title}</li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Follow Us</h3>
          <div>
            <a href="https://facebook.com">
              <img
                src="https://1000logos.net/wp-content/uploads/2017/02/Facebook-Logosu.png"
                alt="Facebook"
                style={{ width: "60px", marginRight: "10px" }}
              />
            </a>
            <a href="https://linkedin.com">
              <img
                src="https://cdn1.iconfinder.com/data/icons/logotypes/32/circle-linkedin-512.png"
                alt="LinkedIn"
                style={{ width: "30px", marginRight: "10px" }}
              />
            </a>
            <a href="https://instagram.com">
              <img
                src="https://static-00.iconduck.com/assets.00/instagram-icon-2048x2048-uc6feurl.png"
                alt="Instagram"
                style={{ width: "30px", marginRight: "10px" }}
              />
            </a>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p>Email: techplementwebteam@gmail.com</p>
          <p>Phone: 9865896349</p>
          <p>
            Address: 102-sentolina , blosoom aura apartments, near canal, nadiad
            (396445), Gujarat, India
          </p>
        </div>
        <br></br>
        <div style={{ flex: 1 }}>
          <p>@2024 Appointy | All Right Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
