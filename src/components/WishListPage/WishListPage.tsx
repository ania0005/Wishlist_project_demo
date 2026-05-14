import { useState, useEffect, Fragment } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, Button, Modal, Dropdown, message } from "antd";
import {
  DeleteOutlined,
  ArrowLeftOutlined,
  ShareAltOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Gift } from "../../types";
import { GoArrowUpRight } from "react-icons/go";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import "./WishListPage.css";
import "../../App.css";
import {
  getWishlistById,
  getGifts,
  deleteWishlist,
  deleteGift,
  createShareUuid,
} from "../../demo/demoStorage";

const WishListPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const navigate = useNavigate();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
  if (!id) return;

  const wishlist = getWishlistById(id);

  if (!wishlist) return;

  setTitle(wishlist.title);
  setComment(wishlist.description);

 

  setGifts(getGifts(id));
}, [id]);

  useEffect(() => {
    gifts.forEach((gift) => {
      const reservationStatus = localStorage.getItem(
        `gift_${gift.id}_reservation`
      );
      if (reservationStatus) {
        setGifts((prevGifts) =>
          prevGifts.map((prevGift) =>
            prevGift.id === gift.id
              ? { ...prevGift, isReserved: reservationStatus === "reserved" }
              : prevGift
          )
        );
      }
    });
  }, [gifts]);

  const handleDeleteClick = () => setShowModal(true);
  const handleAddGiftClick = () => id && navigate(`/wishlist/${id}/createGift`);
  const handleCloseModal = () => setShowModal(false);
  const handleDeleteWishList = () => {
  if (!id) return;

  deleteWishlist(id);
  navigate("/dashboard");
};

  const handleShareClick = () => setShowShareModal(true);
  const handleCopyLink = async () => {
  if (!id) return;

  try {
    const uuid = createShareUuid(id);
    const link = `${window.location.origin}/#/mywishlist/${uuid}`;

    await navigator.clipboard.writeText(link);

    setShowShareModal(false);
    message.success("Link copied", 2);
  } catch (error) {
    console.error("Failed to copy link:", error);
  }
};

  const handleEditGift = (gift: Gift) =>
    gift.id && navigate(`/gift/${gift.id}/editGift`);

  const handleDeleteGift = (gift: Gift) => {
  if (!gift.id) return;

  deleteGift(gift.id);
  setGifts(getGifts(id!));
};

  const giftMenu = (gift: Gift) => [
    { key: "edit", label: "Edit", onClick: () => handleEditGift(gift) },
    { key: "delete", label: "Delete", onClick: () => handleDeleteGift(gift) },
  ];

  return (
    <Fragment>
      <div className="wishlist">
        <header className="wishlist-header">
          <div className="wishlist-profile">
            <Link to="/dashboard" className="go-to-wishlists">
              <ArrowLeftOutlined /> Go to wishlists
            </Link>
            <div className="wishlist-buttons">
              <Button
                onClick={handleDeleteClick}
                className="delete-wl-button"
                icon={<DeleteOutlined />}
              />
              <Button
                onClick={handleShareClick}
                className="share-button"
                icon={<ShareAltOutlined />}
              >
                Share list
              </Button>
              <Button onClick={handleAddGiftClick} className="add-wl-button">
                Add gift
              </Button>
            </div>
            <div className="wishlist-name">{title}</div>
            {comment && <div className="wishlist-comment">{comment}</div>}
          </div>
        </header>
        <main className="wishlist-content">
          {gifts.map((gift) => (
            <Card key={gift.id} className="gift-card">
              <div className="gift-content">
                <div className="gift-body">
                  <div className="gift-left">
                    {gift.imgUrl ? (
                      <img
                        src={gift.imgUrl}
                        alt={gift.title}
                        className="gift-image"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faGift}
                        className="gift-image-placeholder"
                      />
                    )}
                    {gift.url && (
                      <a
                        href={gift.url}
                        className="gift-go-to-store"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        To the store<GoArrowUpRight className="arrow-icon-w" />
                      </a>
                    )}
                  </div>
                  <div className="gift-right">
                    <div className="gift-card-title">{gift.title}</div>
                    <div className="gift-card-price">
                      Price: {gift.price} {gift.currency}
                    </div>
                    <div className="gift-card-comment">
                      Comment: {gift.description}
                    </div>
                  </div>
                  <Dropdown
                    menu={{ items: giftMenu(gift) }}
                    trigger={["click"]}
                  >
                    <MoreOutlined
                      style={{
                        position: "absolute",
                        top: 24,
                        right: 8,
                        fontSize: "24px",
                        fontFamily: "DM Serif Display",
                        cursor: "pointer",
                      }}
                    />
                  </Dropdown>
                </div>
              </div>
            </Card>
          ))}
        </main>
        {showModal && (
          <Modal open={showModal} onCancel={handleCloseModal} footer={null}>
            <p>Do you really want to delete this wishlist?</p>
            <div className="modal-footer">
              <Button
                onClick={handleDeleteWishList}
                className="delete-wl-confirm-button"
              >
                OK
              </Button>
            </div>
          </Modal>
        )}
        {showShareModal && (
          <Modal
            open={showShareModal}
            onCancel={() => setShowShareModal(false)}
            footer={[
              <Button key="copy" onClick={handleCopyLink} className="copy-link">
                Copy
              </Button>,
            ]}
          >
            <p>Copy link?</p>
          </Modal>
        )}
      </div>
    </Fragment>
  );
};

export default WishListPage;
