// frontend/src/hooks/useCafeData.ts
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  MENU_ITEMS,
  GALLERY_ITEMS,
  CAFE_INFO,
  CafeMenuItem,
  CafeGalleryItem,
  CafeInfo,
  getOpenStatusWIB,
} from "@/lib/cafeData";
import {
  getClientMenuItems,
  getClientStatusToko,
  getClientInfoToko,
  getClientGaleri,
  ApiStatusToko,
} from "@/lib/clientApi";

/**
 * Hook untuk mengelola daftar menu dari backend dengan fallback instan ke MENU_ITEMS lokal
 */
export function useMenuData(
  activeCategory = "semua",
  searchQuery = "",
  sortBy: "default" | "price-asc" | "price-desc" | "name-asc" = "default"
) {
  const [items, setItems] = useState<CafeMenuItem[]>(MENU_ITEMS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getClientMenuItems()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setItems(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Filter by Category or Recommended
    if (activeCategory === "rekomendasi") {
      result = result.filter((item) => item.rekomendasi);
    } else if (activeCategory !== "semua") {
      result = result.filter((item) => item.kategori === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.nama.toLowerCase().includes(q) ||
          item.deskripsi.toLowerCase().includes(q) ||
          (item.specs && item.specs.toLowerCase().includes(q)) ||
          (item.rasa && item.rasa.some((r) => r.toLowerCase().includes(q)))
      );
    }

    // Sort items
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.harga - b.harga);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.harga - a.harga);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.nama.localeCompare(b.nama));
    }

    return result;
  }, [items, activeCategory, searchQuery, sortBy]);

  return {
    items: filteredItems,
    allItems: items,
    isLoading,
  };
}

/**
 * Hook untuk memantau status operasional toko real-time WIB dari backend
 */
export function useStoreStatus() {
  const localInitial = getOpenStatusWIB();
  const [status, setStatus] = useState<ApiStatusToko>({
    isOpen: localInitial.isOpen,
    pesanStatus: localInitial.statusText,
    hariIni: localInitial.todayName,
    sekarangJam: localInitial.currentTimeStr,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkStatus = () => {
      getClientStatusToko().then((data) => {
        if (isMounted && data) {
          setStatus(data);
        }
      });
    };

    checkStatus();

    // Polling setiap 45 detik agar status jam operasional selalu up-to-date
    const interval = setInterval(checkStatus, 45000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { status, isLoading };
}

/**
 * Hook untuk mendapatkan profil toko & jam operasional lengkap
 */
export function useCafeInfo() {
  const [info, setInfo] = useState<CafeInfo>(CAFE_INFO);

  useEffect(() => {
    let isMounted = true;
    getClientInfoToko().then((data) => {
      if (isMounted && data) {
        setInfo(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return info;
}

/**
 * Hook untuk mendapatkan data galeri dari backend
 */
export function useGalleryData() {
  const [gallery, setGallery] = useState<CafeGalleryItem[]>(GALLERY_ITEMS);

  useEffect(() => {
    let isMounted = true;
    getClientGaleri().then((data) => {
      if (isMounted && data && data.length > 0) {
        setGallery(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return gallery;
}
