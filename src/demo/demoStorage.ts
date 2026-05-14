import User, { Gift } from "../types";

export type DemoWishlist = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  comment?: string;
  user_id: number;
};

const USER_KEY = "demo_user";
const WISHLISTS_KEY = "demo_wishlists";
const GIFTS_KEY = "demo_gifts";
const SHARE_MAP_KEY = "demo_share_map";

// Получить или создать демо-пользователя
export const getDemoUser = (): User => {
  const savedUser = localStorage.getItem(USER_KEY);

  if (savedUser) {
    return JSON.parse(savedUser);
  }

  const user: User = {
    id: 1,
    firstName: "Anna",
    lastName: "Demo",
    email: "anna@example.com",
  };

  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return user;
};

// Получить все wishlist'ы
export const getWishlists = (): DemoWishlist[] => {
  const data = localStorage.getItem(WISHLISTS_KEY);

  if (data) {
    return JSON.parse(data);
  }

  // Первый демонстрационный wishlist
  const defaultWishlists: DemoWishlist[] = [
    {
      id: "1",
      title: "Birthday Wishlist",
      description: "Gift ideas for my birthday",
      comment: "Gift ideas for my birthday",
      eventDate: "2026-12-20",
      user_id: 1,
    },
  ];

  localStorage.setItem(WISHLISTS_KEY, JSON.stringify(defaultWishlists));

  return defaultWishlists;
};

// Сохранить список wishlist'ов
export const saveWishlists = (wishlists: DemoWishlist[]) => {
  localStorage.setItem(WISHLISTS_KEY, JSON.stringify(wishlists));
};

// Создать новый wishlist
export const createWishlist = (wishlist: {
  title: string;
  description: string | null;
  eventDate: string;
}): DemoWishlist => {
  const wishlists = getWishlists();

  const newWishlist: DemoWishlist = {
    id: Date.now().toString(),
    title: wishlist.title,
    description: wishlist.description || "",
    comment: wishlist.description || "",
    eventDate: wishlist.eventDate,
    user_id: 1,
  };

  const updatedWishlists = [...wishlists, newWishlist];

  saveWishlists(updatedWishlists);

  return newWishlist;
};

// Найти wishlist по id
export const getWishlistById = (
  id: string
): DemoWishlist | undefined => {
  return getWishlists().find((wishlist) => wishlist.id === id);
};

// Удалить wishlist и связанные подарки
export const deleteWishlist = (id: string) => {
  const wishlists = getWishlists().filter(
    (wishlist) => wishlist.id !== id
  );

  saveWishlists(wishlists);

  const gifts = getAllGifts();
  delete gifts[id];
  saveAllGifts(gifts);
};

// Получить все подарки
export const getAllGifts = (): Record<string, Gift[]> => {
  const data = localStorage.getItem(GIFTS_KEY);

  if (data) {
    return JSON.parse(data);
  }

  // Демонстрационные подарки для wishlist с id = "1"
  const defaultGifts: Record<string, Gift[]> = {
    "1": [
      {
        id: "1",
        title: "Kindle Paperwhite",
        price: 150,
        description: "E-book reader",
        url: "https://www.amazon.de",
        imgUrl: "",
        currency: "EUR",
        reserved: false,
        wishlist: {} as any,
      },
      {
        id: "2",
        title: "Sony Headphones",
        price: 300,
        description: "Noise cancelling headphones",
        url: "https://www.amazon.de",
        imgUrl: "",
        currency: "EUR",
        reserved: false,
        wishlist: {} as any,
      },
    ],
  };

  localStorage.setItem(GIFTS_KEY, JSON.stringify(defaultGifts));

  return defaultGifts;
};

// Сохранить все подарки
export const saveAllGifts = (gifts: Record<string, Gift[]>) => {
  localStorage.setItem(GIFTS_KEY, JSON.stringify(gifts));
};

// Получить подарки для конкретного wishlist
export const getGifts = (wishlistId: string): Gift[] => {
  const gifts = getAllGifts();
  return gifts[wishlistId] || [];
};

// Создать новый подарок
export const createGift = (
  wishlistId: string,
  giftData: Omit<Gift, "id" | "wishlist">
): Gift => {
  const gifts = getAllGifts();

  const newGift: Gift = {
    ...giftData,
    id: Date.now().toString(),
    wishlist: {} as any,
  };

  const updatedGifts = {
    ...gifts,
    [wishlistId]: [...(gifts[wishlistId] || []), newGift],
  };

  saveAllGifts(updatedGifts);

  return newGift;
};

// Удалить подарок
export const deleteGift = (giftId: string) => {
  const gifts = getAllGifts();

  const updatedGifts: Record<string, Gift[]> = {};

  Object.keys(gifts).forEach((wishlistId) => {
    updatedGifts[wishlistId] = gifts[wishlistId].filter(
      (gift) => gift.id !== giftId
    );
  });

  saveAllGifts(updatedGifts);
};

// Создать или получить UUID для шаринга
export const createShareUuid = (wishlistId: string): string => {
  const data = localStorage.getItem(SHARE_MAP_KEY);
  const shareMap: Record<string, string> = data
    ? JSON.parse(data)
    : {};

  const existingUuid = Object.keys(shareMap).find(
    (uuid) => shareMap[uuid] === wishlistId
  );

  if (existingUuid) {
    return existingUuid;
  }

  const uuid = `demo-${wishlistId}-${Date.now()}`;

  shareMap[uuid] = wishlistId;

  localStorage.setItem(
    SHARE_MAP_KEY,
    JSON.stringify(shareMap)
  );

  return uuid;
};

// Получить wishlist по UUID
export const getWishlistByUuid = (uuid: string) => {
  const data = localStorage.getItem(SHARE_MAP_KEY);
  const shareMap: Record<string, string> = data
    ? JSON.parse(data)
    : {};

  const wishlistId = shareMap[uuid];

  if (!wishlistId) {
    return null;
  }

  const wishlist = getWishlistById(wishlistId);
  const gifts = getGifts(wishlistId);

  if (!wishlist) {
    return null;
  }

  return {
    ...wishlist,
    gifts,
  };
};

// Обновить статус резервирования подарка
export const updateGiftReservation = (
  giftId: string,
  reserved: boolean
) => {
  const gifts = getAllGifts();

  const updatedGifts: Record<string, Gift[]> = {};

  Object.keys(gifts).forEach((wishlistId) => {
    updatedGifts[wishlistId] = gifts[wishlistId].map((gift) =>
      gift.id === giftId
        ? { ...gift, reserved }
        : gift
    );
  });

  saveAllGifts(updatedGifts);
};