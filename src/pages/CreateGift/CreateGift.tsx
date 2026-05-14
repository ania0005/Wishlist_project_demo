import React, { useState, useRef, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateGift.css";
import { createGift } from "../../demo/demoStorage";

const CreateGift: React.FC = () => {
  const navigate = useNavigate();
  const [giftImgUrl, setGiftImgUrl] = useState<string>("");
  const [giftName, setGiftName] = useState<string>("");
  const [giftLink, setGiftLink] = useState<string>("");
  const [giftPrice, setGiftPrice] = useState<string>("");
  const [giftComment, setGiftComment] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currency, setCurrency] = useState<string>("EUR");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();

  const saveGift = () => {
  if (!id) return;

  const giftData = {
    title: giftName,
    description: giftComment,
    price: parseFloat(giftPrice),
    url: giftLink,
    imgUrl: giftImgUrl,
    currency: currency,
    reserved: false,
  };

  createGift(id, giftData);

  navigate(`/wishlist/${id}`);
};

  const handleSaveClick = async () => {
    if (!giftName.trim()) {
      setErrorMessage(
        "Please enter a gift name."
      );
      return;
    }
    if (!giftLink.trim()) {
      setErrorMessage(
        "Please enter a link where you can buy the gift."
      );
      return;
    }

    if (!giftPrice.trim()) {
      setErrorMessage("Please enter a price for the gift.");
      return;
    }
    if (giftComment.length > 60) {
      setErrorMessage("Comment too long. Please shorten your comment.");
      return;
    }
    if (giftName.length > 125) {
      setErrorMessage("Name too long. Please shorten name.");
      return;
    }

    saveGift();
  };

  const handleImgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setGiftImgUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImgLinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGiftImgUrl(event.target.value);
    setErrorMessage("");
  };

  const handleGiftNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGiftName(event.target.value);
    setErrorMessage("");
  };

  const handleGiftPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGiftPrice(event.target.value);
    setErrorMessage("");
  };

  const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    console.log("Selected currency:", event.target.value); // Log the selected value
    setCurrency(event.target.value);
    setErrorMessage("");
  };

  const handleGiftCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setGiftComment(event.target.value);
    setErrorMessage("");
  };

  const handleGiftLinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGiftLink(event.target.value);
    setErrorMessage("");
  };

  return (
    <div className="wishlist-container-custom">
      <div className="wishlist-card-custom">
        <span className="back-arrow-custom">
          <a href={`/wishlist/${id}`}>&#8592; Back</a>
        </span>
        <h2 className="title-custom">Add a gift</h2>
        <div className="link-input-custom">
          <label className="title-1-custom" htmlFor="gift-link-custom">
            Link where you can buy a gift{" "}
            <span className="required-icon">*</span>
          </label>
          <input
            type="text"
            id="gift-link-custom"
            placeholder="For example"
            className="rounded-input-custom"
            value={giftLink}
            onChange={handleGiftLinkChange}
          />
        </div>
        <div className="input-group-1">
          <div className="right-column">
            <div className="img-input-custom" onClick={handleChooseFile}>
              <div className="file-input-text">
                {giftImgUrl ? (
                  <img src={giftImgUrl} alt="Uploaded" />
                ) : (
                  "Img / Click to upload"
                )}
              </div>
              <input
                type="file"
                id="gift-img-custom"
                className="file-input-custom"
                onChange={handleImgUpload}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
            </div>

            <div className="input-group-custom">
              <label className="title-1-custom" htmlFor="link-custom">
                Img Link
              </label>
              <input
                type="text"
                id="link-custom"
                placeholder="Enter link"
                className="rounded-input-custom"
                value={giftImgUrl}
                onChange={handleImgLinkChange}
              />
            </div>
          </div>

          <div className="left-column">
            <div className="input-group-custom">
              <label className="title-1-custom" htmlFor="gift-name-custom">
                Name <span className="required-icon">*</span>
              </label>
              <input
                type="text"
                id="gift-name-custom"
                placeholder="For example"
                className="rounded-input-custom"
                value={giftName}
                onChange={handleGiftNameChange}
              />
            </div>

            <div className="input-group-custom">
              <label className="title-1-custom" htmlFor="gift-price-custom">
                Price <span className="required-icon">*</span>
              </label>
              <div className="currency-input">
                <input
                  type="text"
                  id="gift-price-custom"
                  className="rounded-input-custom"
                  value={giftPrice}
                  onChange={handleGiftPriceChange}
                />
                <select
                  className="currency-select"
                  value={currency}
                  onChange={handleCurrencyChange}
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            <div className="input-group-custom">
              <label className="title-1-custom" htmlFor="gift-comment-custom">
                Comment on the gift
              </label>
              <textarea
                id="gift-comment-custom"
                placeholder="Write something about the gift..."
                className="rounded-textarea-custom"
                value={giftComment}
                onChange={handleGiftCommentChange}
              ></textarea>
            </div>
          </div>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="input-group-custom">
          <button className="save-button-custom" onClick={handleSaveClick}>
            Save
          </button>
          <p className="required-field-note">* - Field Required</p>
        </div>
      </div>
    </div>
  );
};

export default CreateGift;
