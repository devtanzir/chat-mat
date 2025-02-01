import {
  addDoc,
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firebaseApp } from "./app";

const database = getFirestore(firebaseApp);

/**
 * Create a new data in Firebase
 * @param {string} collectionName
 * @param {object} data
 * @returns {Promise<string>} Document ID of the created data
 */
export const createData = async (collectionName, data) => {
  try {
    const res = await addDoc(collection(database, collectionName), data);
    return res.id; // Return the document ID
  } catch (error) {
    console.error("Error creating data:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

/**
 * Find data in Firebase and update state
 * @param {string} collectionName
 * @param {function} setData
 * @returns {Promise<void>}
 */
export const find = async (collectionName, setData) => {
  try {
    const data = await getDocs(collection(database, collectionName));
    const newData = [];

    data.forEach((item) => {
      newData.push({ ...item.data(), id: item.id });
    });

    setData([...newData]);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

/**
 * Get all data from Firebase with real-time snapshot
 * @param {string} collectionName
 * @param {function} setData
 */
export const findRealTime = async (collectionName, setData) => {
  onSnapshot(
    query(collection(database, collectionName), orderBy("createdAt", "asc")),
    (snapshot) => {
      try {
        const newData = [];

        snapshot.docs.forEach((item) => {
          newData.push({ ...item.data(), id: item.id });
        });

        setData([...newData]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  );
};

/**
 * Update data in Firebase
 * @param {string} collectionName
 * @param {string} docId
 * @param {object} newData
 * @returns {Promise<void>}
 */
export const updateData = async (collectionName, docId, newData) => {
  try {
    const docRef = doc(database, collectionName, docId);
    await updateDoc(docRef, newData);
  } catch (error) {
    console.error("Error updating data:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

/**
 * Delete data from Firebase
 * @param {string} collectionName
 * @param {string} docId
 * @returns {Promise<void>}
 */
export const deleteData = async (collectionName, docId) => {
  try {
    const docRef = doc(database, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};
