"use server";

import { ref, get, remove, update, push } from "firebase/database";

import { db } from "./firebase";
import { Banner } from "@/types";

export const fetchBanners = async (): Promise<Banner[]> => {
    try {
        const bannersRef = ref(db, "banners");

        const snapshot = await get(bannersRef);
        if(!snapshot.exists()) return []

        const data = snapshot.val();

        let list = Object.entries(data).map(([id, val]) => ({ ...(val as any), id }))

        return list;
    } catch(error) {
        console.log(error);
        throw new Error("Could not fetch all banners.")
    }
}

export const fetchBannerById = async (bannerId: string): Promise<Banner> => {
    try {
        const bannerRef = ref(db, `banners/${bannerId}`);

        const snapshot = await get(bannerRef);
        if(!snapshot.exists()) return {} as Banner;

        const data = snapshot.val;

        return {
            id: bannerId,
            ...data
        } as Banner
    } catch(error) {
        console.log(error);
        throw new Error("Could not fetch banner.");
    }
}

export const deleteBanner = async (bannerId: string): Promise<{ success: boolean, message: string }> => {
    try {
        const bannerRef = ref(db, `banners/${bannerId}`);

        await remove(bannerRef);

        return { success: true, message: 'Banner deleted.' };
    } catch(error: any) {
        console.log(error);
        return { success: false, message: error.message };
        // throw new Error("Could not delete banner.");
    }    
}

// Function to create a new banner
export const createBanner = async (bannerData: Omit<Banner, 'id'>): Promise<string> => {
  try {
    const bannersRef = ref(db, 'banners');
    
    const newBannerRef = await push(bannersRef, {
      header: bannerData.header,
      secondaryText: bannerData.secondaryText,
      image: bannerData.image,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    const newBannerId = newBannerRef.key;
    if (!newBannerId) {
      throw new Error('Failed to generate banner ID');
    }
    
    console.log(`Banner created with ID: ${newBannerId}`);
    return newBannerId;
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
};

// Function to update a specific banner by ID
export const updateBanner = async (bannerId: string, bannerData: Partial<Omit<Banner, 'id'>>): Promise<void> => {
  try {
    const bannerRef = ref(db, `banners/${bannerId}`);
    
    await update(bannerRef, {
      header: bannerData.header,
      secondaryText: bannerData.secondaryText,
      image: bannerData.image,
      isActive: bannerData.isActive,
      updatedAt: new Date().toISOString().split("T")[0],
    });
    
    console.log(`Banner ${bannerId} updated successfully`);
  } catch (error) {
    console.error(`Error updating banner ${bannerId}:`, error);
    throw error;
  }
};

// Function to update a specific field of a banner
export const updateBannerField = async (
  bannerId: string,
  field: keyof Omit<Banner, 'id'>, 
  value: string | boolean
): Promise<void> => {
  try {
    const bannerRef = ref(db, `banners/${bannerId}`);
    
    await update(bannerRef, {
      [field]: value,
      updatedAt: new Date().toISOString()
    });
    
    console.log(`Banner ${bannerId} ${field} updated successfully`);
  } catch (error) {
    console.error(`Error updating banner ${bannerId} ${field}:`, error);
    throw error;
  }
}