import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateWishlist.css";
import { createWishlist } from "../../demo/demoStorage";

const CreateWishlist: React.FC = () => {
  const navigate = useNavigate();
  const [wishlistName, setWishlistName] = useState<string>("");
  const [wishlistComment, setWishlistComment] = useState<string>("");
  const [wishlistDate, setWishlistDate] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const saveWishlist = () => {
    createWishlist({
      title: wishlistName,
      description: wishlistComment || null,
      eventDate: wishlistDate,
    });

    console.log("Wishlist saved successfully");
  };

  const handleSaveClick = async () => {
    if (!wishlistName.trim()) {
      setErrorMessage("Please enter a wishlist name.");
      return;
    }
    if (!wishlistDate.trim()) {
      setErrorMessage(
        "Please enter a valid date within the range from today to the next 50 years.",
      );
      return;
    }

    const inputDateObject = new Date(wishlistDate);
    const currentDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(currentDate.getFullYear() + 50);

    if (inputDateObject < currentDate || inputDateObject > maxDate) {
      setErrorMessage(
        "Please enter a valid date within the range from today to the next 50 years.",
      );
      return;
    }

    saveWishlist();
    navigate("/dashboard");
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  const currentDateFormatted = `${currentYear}-${
    currentMonth < 10 ? "0" + currentMonth : currentMonth
  }-${currentDay < 10 ? "0" + currentDay : currentDay}`;

  const maxDate = new Date(currentYear + 50, currentMonth - 1, currentDay);
  const maxYear = maxDate.getFullYear();
  const maxMonth = maxDate.getMonth() + 1;
  const maxDay = maxDate.getDate();

  const maxDateFormatted = `${maxYear}-${
    maxMonth < 10 ? "0" + maxMonth : maxMonth
  }-${maxDay < 10 ? "0" + maxDay : maxDay}`;

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputDate = event.target.value;
    setWishlistDate(inputDate);
    setErrorMessage("");
  };

  const handleWishlistNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWishlistName(event.target.value);
    setErrorMessage("");
  };

  const handleWishlistCommentChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setWishlistComment(event.target.value);
  };

  return (
    <div className="wishlist-container">
      <div className="wishlist-card">
        <span className="back-arrow">
          <a href="/dashboard">← Back</a>
        </span>
        <h2 className="title-custom">Create a wishlist</h2>
        <div className="input-group">
          <label className="title-1-custom" htmlFor="wishlist-name">
            Wishlist name <span className="required-icon">*</span>
          </label>
          <input
            type="text"
            id="wishlist-name"
            placeholder="For example: Birthday, New Year"
            className="rounded-input-custom"
            value={wishlistName}
            onChange={handleWishlistNameChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="comment" className="title-1-custom">
            Comment
          </label>
          <textarea
            id="comment"
            placeholder="Write something to your friends. This could be a greeting, wishes for gifts or an invitation."
            className="rounded-textarea"
            onChange={handleWishlistCommentChange}
          ></textarea>
        </div>
        <div className="input-group">
          <label htmlFor="event-date" className="title-1-custom">
            Event date <span className="required-icon">*</span>
          </label>
          <input
            type="date"
            id="event-date"
            className="rounded-input"
            lang="en"
            value={wishlistDate}
            onChange={handleDateChange}
            min={currentDateFormatted}
            max={maxDateFormatted}
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="input-group">
          <button className="save-button-custom" onClick={handleSaveClick}>
            Save
          </button>
          <p className="required-field-note">* - Field Required</p>
        </div>
      </div>
    </div>
  );
};

export default CreateWishlist;
