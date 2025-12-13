export type Repository = {
	name: string;
	description?: string;
	url: string;
	language?: string;
	stars: number;
};

const DB_NAME = 'TLG_DB';
const STORE_NAME = 'repositories';
const DB_VERSION = 1;

// Initialize database
export const initDB = (): Promise<IDBDatabase> => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: 'name' });
			}
		};
	});
};

// Add repository to IndexedDB
export const addRepository = async (repo: Repository): Promise<void> => {
	const db = await initDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.add(repo);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve();
	});
};

// Get all repositories from IndexedDB
export const getAllRepositories = async (): Promise<Repository[]> => {
	const db = await initDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.getAll();

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);
	});
};

// Get specific repository from IndexedDB
export const getRepository = async (name: string): Promise<Repository | undefined> => {
	const db = await initDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.get(name);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);
	});
};

// Delete repository from IndexedDB
export const deleteRepository = async (name: string): Promise<void> => {
	const db = await initDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.delete(name);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve();
	});
};

// Clear all repositories from IndexedDB
export const clearAllRepositories = async (): Promise<void> => {
	const db = await initDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.clear();

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve();
	});
};
