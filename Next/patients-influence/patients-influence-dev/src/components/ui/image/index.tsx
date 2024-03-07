import React, { useEffect, useRef, useState } from 'react';
import { ImageMain } from 'components/ui/image/styles';
import { TImageProps } from 'components/ui/image/types';

const Image = ({ src, onLoad, ...props }: TImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleLoad = (e: React.ChangeEvent<HTMLImageElement>) => {
    setLoaded(true);
    if (e && onLoad) onLoad(e);
  };

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) setLoaded(true);
  }, []);

  return (
    <ImageMain
      ref={imageRef}
      src={src}
      onLoad={handleLoad}
      loaded={loaded}
      {...props}
    />
  );
};

export default Image;
