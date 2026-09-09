import { useEffect, useState } from "react";
import "./App.css";


/* FORM COMPONENT*/

function ItemForm({ item, onClose, onSuccess }) {

  const [form, setForm] = useState({
    itemName: item?.itemName || "",
    type: item?.type || "lost",
    place: item?.place || "",
    date: item?.date || "",
    contact: item?.contact || ""
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);


  function handleChange(e) {

    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

  }


  async function handleSubmit(e) {

    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {

      const url = item
        ? `/api/items/${item.id}`
        : "/api/items";

      const method = item ? "PUT" : "POST";


      const response = await fetch(url, {
        method: method,

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(form)
      });


      const data = await response.json();

      if (response.status === 400) {
        setError(data.error || "Invalid request");
        return;
      }


      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }


      // Successful POST / PUT
      onSuccess();

    } catch (err) {

      console.error(err);

      setError("Unable to connect to server");

    } finally {

      setSubmitting(false);

    }
  }


  return (
    <div className="modalOverlay">

      <div className="formModal">

        <div className="formHeader">

          <h2>
            {item ? "Edit Item" : "Report an Item"}
          </h2>

          <button
            className="closeButton"
            onClick={onClose}
            type="button"
          >
            ×
          </button>

        </div>


        <form onSubmit={handleSubmit}>

          {/* Item name */}

          <div className="formGroup">

            <label>Item name</label>

            <input
              type="text"
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
            />

          </div>


          {/* Type */}

          <div className="formGroup">

            <label>Type</label>

            <div className="radioGroup">

              <label>
                <input
                  type="radio"
                  name="type"
                  value="lost"
                  checked={form.type === "lost"}
                  onChange={handleChange}
                />

                I lost this
              </label>


              <label>
                <input
                  type="radio"
                  name="type"
                  value="found"
                  checked={form.type === "found"}
                  onChange={handleChange}
                />

                I found this
              </label>

            </div>

          </div>


          {/* Place */}

          <div className="formGroup">

            <label>Place</label>

            <input
              type="text"
              name="place"
              value={form.place}
              onChange={handleChange}
            />

          </div>


          {/* Date */}

          <div className="formGroup">

            <label>Date</label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />

          </div>


          {/* Contact */}

          <div className="formGroup">

            <label>Contact (email or phone)</label>

            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
            />

          </div>


          {/* Server error */}

          {error && (
            <div className="formWarning">
              ⚠ {error}
            </div>
          )}


          {/* Form actions */}

          <div className="formActions">

            <button
              type="button"
              onClick={onClose}
              className="cancelButton"
            >
              Cancel
            </button>


            <button
              type="submit"
              className="submitButton"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit"
              }
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


/* APP*/

function App() {

  const [items, setItems] = useState([]);

  const [active, setActive] = useState("all");

  const [hideClaimed, setHideClaimed] = useState(false);

  const [place, setPlace] = useState("");

  const [loading, setLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);

  const [editingItem, setEditingItem] = useState(null);


  /* GET ITEMS*/

  async function getItems() {

    setLoading(true);

    try {

      const params = new URLSearchParams();

      if (active === "lost") {
        params.append("type", "lost");
      }

      if (active === "found") {
        params.append("type", "found");
      }

      if (hideClaimed) {
        params.append("status", "open");
      }

      if (place.trim() !== "") {
        params.append("place", place.trim());
      }


      const query = params.toString();

      const url = query
        ? `/api/items?${query}`
        : "/api/items";


      const response = await fetch(url);

      const data = await response.json();


      if (!response.ok) {
        console.error(data.error);
        return;
      }


      setItems(data);

    } catch (error) {

      console.error("GET ERROR:", error);

    } finally {

      setLoading(false);

    }
  }


  /* LOAD ON MOUNT + FILTER CHANGES*/

  useEffect(() => {

    getItems();

  }, [active, hideClaimed, place]);


  /*  POST / PUT SUCCESS */

  function handleFormSuccess() {

    setFormOpen(false);

    setEditingItem(null);

    getItems();

  }


  /* DELETE*/

  async function deleteItem(id) {

    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmed) {
      return;
    }


    try {

      const response = await fetch(
        `/api/items/${id}`,
        {
          method: "DELETE"
        }
      );


      if (!response.ok) {

        const data = await response.json();

        console.error(data.error);

        return;
      }


      // Refresh from server

      getItems();

    } catch (error) {

      console.error("DELETE ERROR:", error);

    }
  }


  /* CLAIM*/

  async function claimItem(id) {

    try {

      const response = await fetch(
        `/api/items/${id}/claim`,
        {
          method: "PATCH"
        }
      );


      const data = await response.json();


      if (!response.ok) {

        console.error(data.error);

        return;
      }

      // Refresh from server

      getItems();

    } catch (error) {

      console.error("CLAIM ERROR:", error);

    }
  }


  /* OPEN CREATE FORM */

  function openCreateForm() {

    setEditingItem(null);

    setFormOpen(true);

  }


  /* OPEN EDIT FORM*/

  function openEditForm(item) {

    setEditingItem(item);

    setFormOpen(true);

  }


  return (
    <div>

      {/*NAVBAR*/}

      <nav>

        <h2 id="title">
          Lost & Found
        </h2>


        <button
          id="reportItem"
          onClick={openCreateForm}
        >
          + Report Item
        </button>

      </nav>


      {/*FILTERS*/}

      <div className="filter">

        <div className="filterButtons">

          <button
            id="showAll"
            className={active === "all" ? "active" : ""}
            onClick={() => setActive("all")}
          >
            All
          </button>


          <button
            id="showLost"
            className={active === "lost" ? "active" : ""}
            onClick={() => setActive("lost")}
          >
            Lost
          </button>


          <button
            id="showFound"
            className={active === "found" ? "active" : ""}
            onClick={() => setActive("found")}
          >
            Found
          </button>


          <label
            id="showClaimed"
            className={hideClaimed ? "active" : ""}
          >

            <input
              type="checkbox"
              checked={hideClaimed}
              onChange={(e) =>
                setHideClaimed(e.target.checked)
              }
            />

            Hide Claimed

          </label>

        </div>


        {/* Place */}

        <div id="filterPlace">

          <span>Place:</span>

          <input
            type="text"
            name="place"
            value={place}
            onChange={(e) =>
              setPlace(e.target.value)
            }
            placeholder="Search place"
          />

        </div>

      </div>


      {/*ITEMS*/}

      <div className="itemCard">

        {loading && (
          <div className="loadingMessage">
            Loading items...
          </div>
        )}


        {!loading && items.length === 0 && (
          <div className="emptyMessage">
            No items found.
          </div>
        )}


        {!loading && items.map(elem => (

          <div
            key={elem.id}
            className={
              elem.status === "claimed"
                ? "claimedCard"
                : ""
            }
          >

            <h3
              id="itemType"
              className={
                elem.type === "lost"
                  ? "lostBadge"
                  : "foundBadge"
              }
            >
              [{elem.type}]
            </h3>

            <h2 id="itemName">
              {elem.itemName}
            </h2>

            {elem.status === "claimed" && (
              <h2 id="itemStatus">
                ✓ CLAIMED
              </h2>
            )}

            <h2 id="itemPlace">
              {elem.place}
            </h2>

            <h2 id="itemDate">
              {elem.date}
            </h2>

            <h2 id="itemContact">
              {elem.contact}
            </h2>

            {elem.status !== "claimed" && (

              <button
                id="buttonClaim"
                onClick={() =>
                  claimItem(elem.id)
                }
              >
                Claim
              </button>

            )}


            {/* Edit */}

            <button
              id="buttonEdit"
              onClick={() =>
                openEditForm(elem)
              }
            >
              Edit
            </button>


            {/* Delete */}

            <button
              id="buttonDelete"
              onClick={() =>
                deleteItem(elem.id)
              }
            >
              Delete
            </button>

          </div>

        ))}

      </div>


      {/* FORM */}

      {formOpen && (

        <ItemForm
          item={editingItem}
          onClose={() => {
            setFormOpen(false);
            setEditingItem(null);
          }}
          onSuccess={handleFormSuccess}
        />

      )}

    </div>
  );
}

export default App;