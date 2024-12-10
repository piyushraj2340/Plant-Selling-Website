// utils/imageUtils.js

/**
 * Transform an image URL by adding Cloudinary transformation parameters.
 * @param {string} url - The original Cloudinary image URL.
 * @param {number} width - The desired width of the image (default is 650).
 * @param {number} height - The desired height of the image (default is 550).
 * @param {string} transformation - Additional Cloudinary transformations (optional).
 * @returns {string} - The transformed Cloudinary image URL.
 */
export const transformImageUrl = (url, width = 650, height = 550, transformation = 'c_fill,g_auto') => {
    // Split the URL into the base URL and the file path
    const [baseUrl, filePath] = url.split('/image/upload/');
  
    // Construct the transformation string
    const transformationString = `w_${width},h_${height},${transformation}`;
  
    // Return the full transformed URL
    return `${baseUrl}/image/upload/${transformationString}/${filePath}`;
  };
  