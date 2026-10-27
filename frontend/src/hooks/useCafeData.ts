// frontend/src/hooks/useCafeData.ts
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  GALLERY_ITEMS,
  CAFE_INFO,
  CafeMenuItem,
  CafeGalleryItem,
  CafePromoItem,
  CafeInfo,
  getOpenStatusWIB,
} from "@/lib/cafeData";
import {
  getClientMenuItems,
  getClientMenuResult,
  getClientStatusToko,
  getClientInfoToko,
  getClientGaleri,
  getClientPromo,
  getClientPromoResult,
  ApiStatusToko,
} from "@/lib/clientApi";

export type MenuStatus = "loading" | "success" | "empty" | "error";

export type MenuDataHookResult = {
  items: CafeMenuItem[];
  allItems: CafeMenuItem[];
  status: MenuStatus;
  error: string | null;
  refetch: () => Promise<void>;
  isLoading: boolean;
};

/**
 * Hook untuk mengelola daftar menu dari CMS:
 * - Tidak menggunakan template/data statis jika kosong atau gagal terhubung
 * - "empty": Belum ada menu yang dimasukkan ke dalam CMS
 * - "error": Sistem tidak dapat terhubung ke server CMS
 * - "success": Terdapat menu yang aktif dari CMS
 */
export function useMenuData(
  activeCategory = "semua",
  searchQuery = "",
  sortBy: "default" | "price-asc" | "price-desc" | "name-asc" = "default"
): MenuDataHookResult {
  const [allItems, setAllItems] = useState<CafeMenuItem[]>([]);
  const [status, setStatus] = useState<MenuStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    setStatus("loading");
    setError(null);

    const result = await getClientMenuResult();

    if (result.status === "success") {
      setAllItems(result.data);
      setStatus("success");
      setError(null);
    } else if (result.status === "empty") {
      setAllItems([]);
      setStatus("empty");
      setError(null);
    } else {
      setAllItems([]);
      setStatus("error");
      setError(result.error || "Sistem tidak dapat terhubung ke CMS");
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const filteredItems = useMemo(() => {
    if (status !== "success" || allItems.length === 0) {
      return [];
    }

    let result = [...allItems];

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
  }, [allItems, activeCategory, searchQuery, sortBy, status]);

  return {
    items: filteredItems,
    allItems,
    status,
    error,
    refetch: fetchMenu,
    isLoading: status === "loading",
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

export type PromoStatus = "loading" | "success" | "empty" | "error";

export type PromoDataHookResult = CafePromoItem[] & {
  promos: CafePromoItem[];
  status: PromoStatus;
  error: string | null;
  refetch: () => Promise<void>;
};

/**
 * Hook untuk mendapatkan data promo & kegiatan kafe dari backend:
 * - Tidak menggunakan template statis jika data kosong (array === 0).
 * - "empty": Promo memang tidak terdapat pada CMS (promo tidak tersedia).
 * - "error": CMS tidak terhubung atau tidak tersambung (data tidak dapat ditemukan).
 * - "success": Terdapat promo aktif.
 */
export function usePromoData(): PromoDataHookResult {
  const [state, setState] = useState<{
    promos: CafePromoItem[];
    status: PromoStatus;
    error: string | null;
  }>({
    promos: [],
    status: "loading",
    error: null,
  });

  const fetchPromos = useCallback(async () => {
    setState((prev) => ({ ...prev, status: "loading", error: null }));
    const result = await getClientPromoResult();

    if (result.status === "success") {
      setState({
        promos: result.data,
        status: "success",
        error: null,
      });
    } else if (result.status === "empty") {
      setState({
        promos: [],
        status: "empty",
        error: null,
      });
    } else {
      setState({
        promos: [],
        status: "error",
        error: result.error || "Data tidak dapat ditemukan",
      });
    }
  }, []);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  // Buat hybrid result: Array dari items yang juga memiliki properti status, promos, error, refetch
  const hybrid = [...state.promos] as PromoDataHookResult;
  hybrid.promos = state.promos;
  hybrid.status = state.status;
  hybrid.error = state.error;
  hybrid.refetch = fetchPromos;

  return hybrid;
}
