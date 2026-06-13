const backendBaseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function getCurrentUser() {
    try {
        const response = await fetch(`${backendBaseUrl}/api/user`, {
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.log("Error fetch current user:", error);
        return null;
    }
}

export async function getMovieDetail(id) {
    try {
        const response = await fetch(`${backendBaseUrl}/api/movies/${id}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.log("Failed to fetch movie detail:", response.status);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.log("Error fetch movie detail:", error);
        return null;
    }
}

export async function searchMovies(query) {
    try {
        const params = new URLSearchParams({ query });
        const response = await fetch(`${backendBaseUrl}/api/movies/search?${params}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return data?.results || [];
    } catch (error) {
        console.log("Error search movies:", error);
        return [];
    }
}

export async function getMovieReviews(tmdbMovieId) {
    try {
        const response = await fetch(
            `${backendBaseUrl}/api/movies/${tmdbMovieId}/reviews`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            return [];
        }

        return await response.json();
    } catch (error) {
        console.log("Error fetch movie reviews:", error);
        return [];
    }
}

export async function createMovieReview(tmdbMovieId, data) {
    try {
        const response = await fetch(
            `${backendBaseUrl}/api/movies/${tmdbMovieId}/reviews`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.log("Failed to create movie review:", response.status, result);
            return null;
        }

        return result;
    } catch (error) {
        console.log("Error create movie review:", error);
        return null;
    }
}
