/** URL de base du backend YowPainter (sans suffixe /api). */
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === 'development'
        ? 'http://localhost:8090'
        : 'https://yowpainter-backend-lpbz.onrender.com');
