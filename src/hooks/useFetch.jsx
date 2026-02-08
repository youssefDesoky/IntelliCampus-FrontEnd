import { useEffect, useState } from "react";
import { API_URL } from "../config/api";

export default function useFetch(url, options = {}, enabled = true) {

    const [fetchedData, setFetchedData] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!enabled) return;

        async function fetchData() {
            setIsFetching(true);

            try {
                const res = await fetch(`${API_URL}/${url}`, {
                    ...options,
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        ...options.headers,
                    },
                });

                if (!res.ok) {
                    throw new Error(`Error: ${res.status} ${res.statusText}`);
                }

                const json = await res.json();
                setFetchedData(json);
            } catch (err) {
                setError({message: err.message || "Failed to fetch data"});
            }

            setIsFetching(false);
        }

        fetchData();
    }, [url, enabled]);

    return { fetchedData, isFetching, error };
}
