import { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import { Card, Button } from "antd";
import { Gift } from "../../types";
import { GoArrowUpRight } from "react-icons/go";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import "./SharePage.css";
import {
  getWishlistByUuid,
  updateGiftReservation,
} from "../../demo/demoStorage";

const SharePage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState<moment.Moment | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [description, setDescription] = useState("");
  const { uuid } = useParams<{ uuid: string }>();

  

  useEffect(() => {
  if (!uuid) return;

  const sharedWishlist = getWishlistByUuid(uuid);

  if (!sharedWishlist) return;

  setTitle(sharedWishlist.title);
  setDescription(sharedWishlist.description);

  if (sharedWishlist.eventDate) {
    setEventDate(moment(sharedWishlist.eventDate));
  }

  setGifts(sharedWishlist.gifts);
}, [uuid]);

  const handleReserveClick = (id: string) => {
  const updatedGifts = gifts.map((gift) =>
    gift.id === id ? { ...gift, reserved: !gift.reserved } : gift
  );

  setGifts(updatedGifts);

  const updatedGift = updatedGifts.find((gift) => gift.id === id);

  if (updatedGift) {
    updateGiftReservation(id, updatedGift.reserved);
  }
};

  const calculateDaysLeft = (): string => {
    if (!eventDate) return "";
    const now = moment();
    const daysLeft = eventDate.diff(now, "days");
    if (daysLeft < 0) {
      return `Event has expired`;
    } else if (daysLeft === 0) {
      return "Event today";
    }
    return `in ${daysLeft} day(s)`;
  };

  return (
    <Fragment>
      <div className="share-wishlist">
        <header className="share-header">
          <div className="share-event-date">
            {eventDate && (
              <div className="days-left-container">
                <div className="date">{eventDate.format("DD/MM/YYYY")}</div>
                <div
                  className="days-left"
                  style={{
                    backgroundColor: "orange",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  {calculateDaysLeft()}
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="share-title">{title}</div>
            <div className="share-description">{description}</div>
          </div>
        </header>
        <main className="share-content">
          <div className="share-gift-cards">
            {gifts.map((gift) => (
              <Card key={gift.id} className="share-card">
                <div className="share-card-content">
                  <div className="share-body">
                    <div className="share-card-left">
                      {gift.imgUrl ? (
                        <img
                          src={gift.imgUrl}
                          alt={gift.title}
                          className="share-gift-image"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faGift}
                          className="share-gift-image-placeholder"
                        />
                      )}
                      {gift.url && (
                        <a
                          href={gift.url}
                          className="share-go-to-store"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          To the store<GoArrowUpRight className="arrow-icon" />
                        </a>
                      )}
                    </div>
                    <div className="share-card-right">
                      <div className="share-card-title">{gift.title}</div>
                      <div className="share-card-price">
                        Price: {gift.price} {gift.currency}
                      </div>
                      <div className="share-card-comment">
                        Comment: {gift.description}
                      </div>
                      <Button
                        onClick={() => handleReserveClick(gift.id)}
                        className={`share-reserve-button ${
                          gift.reserved ? "reserved" : ""
                        }`}
                      >
                        {gift.reserved ? "Reserved" : "Reserve"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </Fragment>
  );
};

export default SharePage;
