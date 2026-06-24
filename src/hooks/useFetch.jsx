import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

export default function useFetch(url, options = {}, enabled = true) {

    const [fetchedData, setFetchedData] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!enabled) return;

        async function fetchData() {
            setIsFetching(true);

            try {
                const json = await apiClient(url, options);
                setFetchedData(json);
            } catch (err) {
                setError({ message: err.message || "Failed to fetch data" });
            }

            setIsFetching(false);
        }

        fetchData();
    }, [url, enabled]);

    return { fetchedData, isFetching, error };
}
