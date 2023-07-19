import React, { useState } from "react";

const PictureUpload = () => {
  const [image, setImage] = useState(null);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    return image;
  };
  return (
    <div>
      <input type="file" accept={"image/*"} onChange={handleImageUpload} />
    </div>
  );
};

export default PictureUpload;
