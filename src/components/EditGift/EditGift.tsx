import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGiftById, updateGift as updateDemoGift } from "../../demo/demoStorage";

const EditGift: React.FC = () => {
  const navigate = useNavigate();
  const [giftImgUrl, setGiftImgUrl] = useState<string>("");
  const [giftName, setGiftName] = useState<string>("");
  const [giftLink, setGiftLink] = useState<string>("");
  const [giftPrice, setGiftPrice] = useState<string>("");
  const [wishlistId, setWishlistId] = useState<string>("");
  const [giftComment, setGiftComment] = useState<string>("");
  const [giftIsReserved, setGiftIsReserved] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currency, setCurrency] = useState<string>("EUR");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id: giftId } = useParams<{ id: string }>();

  useEffect(() => {
  if (!giftId) return;

  const result = getGiftById(giftId);

  if (!result) {
    setErrorMessage("Gift not found");
    return;
  }

  const { gift, wishlistId } = result;

  setGiftImgUrl(gift.imgUrl || "");
  setGiftName(gift.title || "");
  setGiftLink(gift.url || "");
  setGiftPrice(gift.price.toString());
  setGiftComment(gift.description || "");
  setCurrency(gift.currency || "EUR");
  setGiftIsReserved(gift.reserved);
  setWishlistId(wishlistId);
}, [giftId]);

  const updateGift = () => {
  if (!giftId) return;

  updateDemoGift(giftId, {
    title: giftName,
    url: giftLink,
    price: parseFloat(giftPrice),
    description: giftComment,
    reserved: giftIsReserved,
    imgUrl: giftImgUrl,
    currency: currency,
  });

  navigate(`/wishlist/${wishlistId}`);
};
  const handleSaveClick = async () => {
    setErrorMessage(""); // Clear previous error messages

    if (!giftName.trim()) {
      setErrorMessage("Please enter a gift name.");
      return;
    }
    if (!giftLink.trim()) {
      setErrorMessage("Please enter a link where you can buy the gift.");
      return;
    }
    if (!giftPrice.trim()) {
      setErrorMessage("Please enter the gift price.");
      return;
    }
    if (giftComment.length > 70) {
      setErrorMessage("Comment too long. Please shorten your comment.");
      return;
    }
    if (giftName.length > 40) {
      setErrorMessage("Name too long. Please shorten name.");
      return;
    }
    if (giftImgUrl.length > 80000) {
      setErrorMessage("Image is too large. Please choose a smaller image.");
      return;
    }

    updateGift();
  };

  const handleImgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const result = event.target.result as string;
          if (result.length > 80000) {
            setErrorMessage("Url of the image is too large. Please choose another image.");
          } else {
            setGiftImgUrl(result);
          }
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

  return (
    <div className="wishlist-container-custom">
      <div className="wishlist-card-custom">
        <span className="back-arrow-custom">
          <a href={`/#/wishlist/${wishlistId}`}>&#8592; Back</a>
        </span>
        <h2 className="title-custom">Edit Gift</h2>
        <div className="link-input-custom">
          <label className="title-1-custom" htmlFor="gift-link-custom">
            Link where you can buy a gift
          </label>
          <input
            type="text"
            id="gift-link-custom"
            placeholder="For example"
            className="rounded-input-custom"
            value={giftLink}
            onChange={(e) => setGiftLink(e.target.value)}
          />
        </div>
        <div className="input-group-1">
          <div className="right-column">
            <div className="img-input-custom" onClick={handleChooseFile}>
              <div className="file-input-text">
                {giftImgUrl ? (
                  <img src={giftImgUrl} alt="Uploaded" />
                ) : (
                  "Image / Click to upload"
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
                Image Link
              </label>
              <input
                type="text"
                id="link-custom"
                placeholder="Enter link"
                className="rounded-input-custom"
                value={giftImgUrl}
                onChange={(e) => setGiftImgUrl(e.target.value)}
              />
            </div>
          </div>
          <div className="left-column">
            <div className="input-group-custom">
              <label className="title-1-custom" htmlFor="gift-name-custom">
                Name
              </label>
              <input
                type="text"
                id="gift-name-custom"
                placeholder="For example"
                className="rounded-input-custom"
                value={giftName}
                onChange={(e) => setGiftName(e.target.value)}
              />
            </div>
            <div className="input-group-custom">
              <label className="title-1-custom" htmlFor="gift-price-custom">
                Price
              </label>
              <div className="currency-input">
                <input
                  type="text"
                  id="gift-price-custom"
                  className="rounded-input-custom"
                  value={giftPrice}
                  onChange={(e) => setGiftPrice(e.target.value)}
                />
                <select
                  className="currency-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            <div className="input-group-custom">
              <label className="title-1-custom" htmlFor="gift-comment-custom">
                Comment
              </label>
              <textarea
                id="gift-comment-custom"
                placeholder="Write something about the gift..."
                className="rounded-textarea-custom"
                value={giftComment}
                onChange={(e) => setGiftComment(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="input-group-custom">
          <button className="save-button-custom" onClick={handleSaveClick}>
            Save
          </button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default EditGift;
