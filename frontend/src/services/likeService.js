const backendBaseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function getLikedMovies() {
    try {
        const response = await fetch(`${backendBaseUrl}/api/likes`, {
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return [];
        }

        return await response.json();
    } catch (error) {
        console.log("Error fetch liked movies:", error);
        return [];
    }
}

export async function checkMovieLike(tmdbMovieId) {
    try {
        const response = await fetch(
            `${backendBaseUrl}/api/movies/${tmdbMovieId}/likes/check`,
            {
                credentials: "include",
                headers: {
                    Accept: "application/json",
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            return false;
        }

        const data = await response.json();

        return data.liked;
    } catch (error) {
        console.log("Error check movie like:", error);
        return false;
    }
}

export async function likeMovie(tmdbMovieId) {
    try {
        const response = await fetch(
            `${backendBaseUrl}/api/movies/${tmdbMovieId}/likes`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.log("Error like movie:", error);
        return null;
    }
}

export async function unlikeMovie(tmdbMovieId) {
    try {
        const response = await fetch(
            `${backendBaseUrl}/api/movies/${tmdbMovieId}/likes`,
            {
                method: "DELETE",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.log("Error unlike movie:", error);
        return null;
    }
}
