"use server"

import { ref, remove, query, orderByKey, startAfter, limitToFirst, get, orderByChild, equalTo } from "firebase/database"

import { db, auth } from "./firebase"
import { Order, User } from "@/types"

export const fetchUsers = async (
    searchTerm?: string
): Promise<User[]> => {
    try {
        const userRef = ref(db, "users");

        const snapshot = await get(userRef);
        if(!snapshot.exists()) return [];

        const data = snapshot.val();
        let list: User[] = Object.entries(data).map(([id, val]) => ({ ...(val as any), id }));

        const populatedLists = list.map(async (user, index) => {
            if(!user.orders) return { ...user, orders: []};
            let userOrders: Order[] = [];

            const orderIds = Array.isArray(user.orders)
            ? user.orders
            : Object.keys(user.orders);
            for(const order of orderIds) {
                const orderRef = ref(db, `orders/${order}`);
                const snap = await get(orderRef);
                const orderData = snap.val();

                userOrders.push({
                    id: order,
                    ...orderData
                } as Order);
            }

            return { ...user, orders: userOrders }
        })

        const result = await Promise.all(populatedLists);

        return result;

        // return list;
    } catch(error) {
        console.log(error);
        return []
    }
}

export const getUserById = async (userId: string): Promise<User> => {
    try {
        const usersRef = ref(db, `users/${userId}`);

        const snapshot = await get(usersRef);
        if(!snapshot.exists()) return {} as User;

        return {
            id: userId,
            ...snapshot.val()
        } as User
    } catch(error) {
        console.log(error);
        return {} as User
    }
}

export const deleteUserById = async (userId: string): Promise<{ success: boolean, message: string}> => {
    try {
        const user = auth.currentUser;
        if(!user) throw new Error("Not authenticated.");

        const userRef = ref(db, `users/${userId}`);
        await remove(userRef);

        return { success: true, message: "user deleted."}
    } catch(error) {
        console.log(error);
        return { success: false, message: "an error occured."};
    }
}