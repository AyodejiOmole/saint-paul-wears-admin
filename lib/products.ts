"use server";

import { ref, update, remove, query, orderByKey, startAfter, limitToFirst, get, orderByChild, equalTo } from "firebase/database"

import { db, auth } from "./firebase"
import { Product } from "@/types"

export const fetchProducts = async (
//   pageSize: number,
//   lastKey?: string | null,
//   searchTerm?: string,
//   category?: string | null
): Promise<Product[]> => {
  const prodRef = ref(db, "products")

//   let prodQuery = lastKey
//     ? query(prodRef, orderByKey(), startAfter(lastKey), limitToFirst(pageSize))
//     : query(prodRef, orderByKey(), limitToFirst(pageSize))

//   // If filtering by category:
//   if (category) prodQuery = query(prodRef, orderByChild("category"), equalTo(category), limitToFirst(pageSize))

  const snapshot = await get(prodRef)
  if (!snapshot.exists()) return []

  let data = snapshot.val()
  console.log(data);

  let list = Object.entries(data).map(([id, val]) => ({ ...(val as any), id }))

//   if (searchTerm) {
//     const term = searchTerm.toLowerCase()
//     list = list.filter(p => p.name.toLowerCase().includes(term))
//   }

  return list
}

// Delete Product
export async function deleteProduct(productId: string) {
  try {
    // Delete product
    const productRef = ref(db, `products/${productId}`);
    await remove(productRef);

    // Clean up related data
    // const updates = {};
    
    // Remove from all user carts
    // const cartsSnapshot = await get(ref(db, 'carts'));
    // if (cartsSnapshot.exists()) {
    //   const cartsData = cartsSnapshot.val();
    //   Object.keys(cartsData).forEach(userId => {
    //     if (cartsData[userId][productId]) {
    //       updates[`carts/${userId}/${productId}`] = null;
    //     }
    //   });
    // }

    // Apply cleanup updates
    // if (Object.keys(updates).length > 0) {
    //   await update(ref(db), updates);
    // }

    return { success: true, message: 'Product deleted successfully' };
  } catch (error: any) {
    console.error('Delete product error:', error);
    return { success: false, message: error.message };
  }
}
