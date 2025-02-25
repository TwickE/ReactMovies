// src/utils/formatters.ts

/**
 * Formats a date string from "YYYY-MM-DD" to "Month DD, YYYY"
 */
export const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    const currentLanguage = localStorage.getItem('language') || 'en';
    const locale = currentLanguage === 'pt' ? 'pt-BR' : 'en-US';
    
    return date.toLocaleDateString(locale, {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

/**
 * Formats a date string from "YYYY-MM-DD" to "YYYY"
 */
export const formatYear = (dateString: string) => {
    return  dateString.split("-")[0];
};

/**
 * Converts runtime (in minutes) to "Xh Ym" format
 */
export const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
};

/**
 * Formats a large number into a readable currency format (millions, billions)
 */
export const formatRevenue = (num: number) => {
    const currentLanguage = localStorage.getItem('language') || 'en';
    const locale = currentLanguage === 'pt' ? 'pt-PT' : 'en-US';
    
    if (num >= 1_000_000_000) {
        return currentLanguage === 'pt' 
            ? `${(num / 1_000_000_000).toFixed(1)}€ mil milhões`
            : `$ ${(num / 1_000_000_000).toFixed(1)} billion`;
    } else if (num >= 1_000_000) {
        return currentLanguage === 'pt'
            ? `${(num / 1_000_000).toFixed(1)}€ milhões`
            : `$ ${(num / 1_000_000).toFixed(1)} million`;
    } else if (num >= 100_000) {
        return currentLanguage === 'pt'
            ? `${(num / 1_000).toFixed(1)}€ mil`
            : `$ ${(num / 1_000).toFixed(1)} thousand`;
    } else if (num >= 10_000) {
        return currentLanguage === 'pt'
            ? `${(num / 1_000).toFixed(1)}€ mil`
            : `$ ${(num / 1_000).toFixed(1)} thousand`;
    } else if (num >= 1_000) {
        return currentLanguage === 'pt'
            ? `${(num / 1_000).toFixed(1)}€ mil`
            : `$ ${(num / 1_000).toFixed(1)} thousand`;
    }
    
    return currentLanguage === 'pt'
        ? `${num.toLocaleString(locale)}€`
        : `$ ${num.toLocaleString(locale)}`;
};
