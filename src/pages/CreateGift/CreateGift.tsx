import React, { useState, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateGift.css";
import { createGift } from "../../demo/demoStorage";
import { demoGifts } from "../../demo/demoData";

const CreateGift: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [giftImgUrl, setGiftImgUrl] = useState<string>("");
  const [giftName, setGiftName] = useState<string>("");
  const [giftLink, setGiftLink] = useState<string>("");
  const [giftPrice, setGiftPrice] = useState<string>("");
  const [giftComment, setGiftComment] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currency, setCurrency] = useState<string>("EUR");
  const [showDemoImages, setShowDemoImages] = useState<boolean>(false);

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
      setErrorMessage("Please enter a gift name.");
      return;
    }

    if (giftName.length > 125) {
      setErrorMessage("Name too long. Please shorten name.");
      return;
    }

    if (!giftLink.trim()) {
      setErrorMessage("Please enter a link where you can buy the gift.");
      return;
    }

    if (giftLink.length > 500) {
      setErrorMessage("Gift link is too long. Maximum 500 characters allowed.");
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

    saveGift();
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
            placeholder="Paste product link, max. 500 characters"
            className="rounded-input-custom"
            value={giftLink}
            onChange={handleGiftLinkChange}
            maxLength={500}
          />
        </div>

        <div className="input-group-1">
          <div className="right-column">
            <div className="img-input-custom">
              <div
                className="file-input-text"
                onClick={() => setShowDemoImages(true)}
              >
                {giftImgUrl ? (
                  <img src={giftImgUrl} alt="Selected gift" />
                ) : (
                  "Click to choose image"
                )}
              </div>
            </div>

            <div className="input-group-custom">
              <label className="title-1-custom" htmlFor="link-custom">
                Img Link
              </label>
              <input
                type="text"
                id="link-custom"
                placeholder="Or paste image link"
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
                maxLength={125}
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
                maxLength={60}
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

      {showDemoImages && (
        <div className="modal-overlay">
          <div className="image-modal">
            <button
              className="modal-close-button"
              onClick={() => setShowDemoImages(false)}
            >
              ×
            </button>

            <h3 className="modal-title">Choose gift image</h3>

            <div className="modal-image-grid">
              {demoGifts.map((gift, index) => (
                <img
                  key={index}
                  src={gift.imgUrl}
                  alt={gift.title}
                  onClick={() => {
                    setGiftImgUrl(gift.imgUrl);
                    setShowDemoImages(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGift;
