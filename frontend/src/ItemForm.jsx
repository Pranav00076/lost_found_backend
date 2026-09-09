import { useEffect, useState } from "react";

export default function ItemForm({ item, onClose, onSuccess }) {

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
