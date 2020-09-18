
export function isValid (value){
    if (value !== null && value !== undefined) {
        if (typeof value === "string") {
            return value.trim().length > 0;
        }
        if (typeof value === "number") {
            return true;
        }
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        if (typeof value === "object") {
            return Object.getOwnPropertyNames(value).length > 0
        }
    }

    return false;
}