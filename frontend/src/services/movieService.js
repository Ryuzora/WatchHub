const backendBaseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function getMovieDetail(id) {
    try {
        const response = await fetch(`${backendBaseUrl}/api/movies/${id}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.log("Gagal fetch movie detail:", response.status);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.log("Error fetch movie detail:", error);
        return null;
    }
}
