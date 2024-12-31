// I would like to thank ChatGPT for helping with a lot of this code <3

// Function to load an image and store it as a base64 string in session storage
export const storeImageInSessionStorage = async (imgSrc: string): Promise<void> => {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Ensure the image can be fetched with CORS

    img.onload = () => {
      // Create a canvas to draw the image and then convert it to base64
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png'); // Convert canvas to base64 image
        sessionStorage.setItem(`GoblinsImage_${imgSrc}`, dataUrl); // Store in sessionStorage
      }
    };

    img.src = imgSrc; // Start loading the image
  } catch (error) {
    console.error('Error loading and storing image:', error);
  }
};

// Function to retrieve the image from session storage as a base64 string and return an HTMLImageElement
export const loadImageFromSessionStorage = (imgSrc: string): HTMLImageElement | null => {
  const dataUrl = sessionStorage.getItem(`GoblinsImage_${imgSrc}`);

  if (dataUrl) {
    const img = new Image();
    img.src = dataUrl; // Set the image source to the base64 string
    return img;
  }

  return null; // Return null if no image is found in sessionStorage
};

// setImage callback that also updates the image in sessionStorage
export const updateImageInSessionStorage = (imgSrc: string, newImage: HTMLImageElement) => {
  // Store the image in sessionStorage
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    canvas.width = newImage.width;
    canvas.height = newImage.height;
    ctx.drawImage(newImage, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    sessionStorage.setItem(`GoblinsImage_${imgSrc}`, dataUrl); // Store in sessionStorage
  }
};
