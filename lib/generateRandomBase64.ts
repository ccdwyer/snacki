export const generateRandomBase64 = (length: number): string => {
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
    return btoa(String.fromCharCode(...randomBytes));
};
