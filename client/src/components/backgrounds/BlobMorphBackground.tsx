import { useEffect, useRef } from "react";

/**
 * BlobMorphBackground - Hero background animation component
 *
 * Large abstract blob shapes that slowly morph and change form.
 * Organic, fluid movement with a modern, premium feel.
 * Uses Typeless pastels with low opacity and large blur for depth.
 */

// Blob path keyframes for smooth morphing
const blobPaths = {
  blob1: [
    "M45.3,-76.5C58.9,-69.3,70.1,-56.7,77.8,-42.2C85.5,-27.7,89.8,-11.2,88.3,4.5C86.8,20.2,79.5,35.1,69.3,47.6C59.1,60.1,46,70.2,31.4,76.3C16.8,82.4,0.7,84.5,-15.7,82.3C-32.1,80.1,-48.8,73.6,-62.1,62.7C-75.4,51.8,-85.3,36.5,-89.1,19.8C-92.9,3.1,-90.6,-15,-83.3,-30.5C-76,-46,-63.7,-58.9,-49.1,-65.8C-34.5,-72.7,-17.3,-73.6,-0.2,-73.3C16.9,-73,31.7,-83.7,45.3,-76.5Z",
    "M42.1,-72.3C54.4,-65.2,64,-53.1,71.8,-39.4C79.6,-25.7,85.6,-10.4,85.1,4.7C84.6,19.8,77.6,34.7,67.7,47.1C57.8,59.5,45,69.4,30.6,75.4C16.2,81.4,0.2,83.5,-16.2,81.7C-32.6,79.9,-49.4,74.2,-62.4,63.4C-75.4,52.6,-84.6,36.7,-88.5,19.5C-92.4,2.3,-91,-16.2,-83.7,-31.9C-76.4,-47.6,-63.2,-60.5,-48.2,-66.7C-33.2,-72.9,-16.6,-72.4,-0.4,-71.7C15.8,-71,29.8,-79.4,42.1,-72.3Z",
    "M47.2,-79.1C61.2,-71.8,72.6,-58.6,79.9,-43.6C87.2,-28.6,90.4,-11.8,88.7,4.3C87,20.4,80.4,35.8,70.3,48.5C60.2,61.2,46.6,71.2,31.6,77.1C16.6,83,-0.8,84.8,-18.1,82.2C-35.4,79.6,-52.6,72.6,-65.4,61C-78.2,49.4,-86.6,33.2,-89.4,16C-92.2,-1.2,-89.4,-19.4,-82,-34.8C-74.6,-50.2,-62.6,-62.8,-48.3,-69.8C-34,-76.8,-17,-78.2,0.2,-78.5C17.4,-78.8,33.2,-86.4,47.2,-79.1Z",
  ],
  blob2: [
    "M38.2,-65.1C49.5,-58.9,58.7,-48.4,66.4,-36.2C74.1,-24,80.3,-10.1,80.5,3.9C80.7,17.9,74.9,32,66.1,44.1C57.3,56.2,45.5,66.3,31.8,72.6C18.1,78.9,2.5,81.4,-13.4,79.5C-29.3,77.6,-45.5,71.3,-58.3,60.5C-71.1,49.7,-80.5,34.4,-84.3,17.8C-88.1,1.2,-86.3,-16.7,-79.1,-31.9C-71.9,-47.1,-59.3,-59.6,-44.8,-64.4C-30.3,-69.2,-13.9,-66.3,0.5,-67.1C14.9,-67.9,26.9,-71.3,38.2,-65.1Z",
    "M41.5,-70.4C53.4,-63.5,62.7,-51.6,70.1,-38.3C77.5,-25,83,-10.3,82.8,4.1C82.6,18.5,76.7,32.6,67.6,44.4C58.5,56.2,46.2,65.7,32.4,71.9C18.6,78.1,3.3,81,-12.5,79.8C-28.3,78.6,-44.6,73.3,-57.2,63.1C-69.8,52.9,-78.7,37.8,-82.8,21.4C-86.9,5,-86.2,-12.7,-80.3,-28.1C-74.4,-43.5,-63.3,-56.6,-49.6,-62.8C-35.9,-69,-19.6,-68.3,-2.4,-64.5C14.8,-60.7,29.6,-77.3,41.5,-70.4Z",
    "M35.9,-61.6C46.3,-55.4,54.4,-44.8,61.8,-33C69.2,-21.2,75.9,-8.2,77.1,6.1C78.3,20.4,74,36,65.4,48.3C56.8,60.6,43.9,69.6,29.6,74.8C15.3,80,-0.4,81.4,-16.3,78.8C-32.2,76.2,-48.3,69.6,-60.5,58.4C-72.7,47.2,-81,31.4,-83.6,14.6C-86.2,-2.2,-83.1,-20,-75.4,-35C-67.7,-50,-55.4,-62.2,-41.5,-66.6C-27.6,-71,-12.1,-67.6,0.9,-69.1C13.9,-70.6,25.5,-67.8,35.9,-61.6Z",
  ],
  blob3: [
    "M33.4,-57.2C42.9,-51.3,50.1,-41.6,57.2,-30.7C64.3,-19.8,71.3,-7.7,72.4,5.3C73.5,18.3,68.7,32.2,60.1,43.4C51.5,54.6,39.1,63.1,25.2,68.6C11.3,74.1,-4.1,76.6,-18.9,74.3C-33.7,72,-47.9,64.9,-58.5,53.8C-69.1,42.7,-76.1,27.6,-78.5,11.6C-80.9,-4.4,-78.7,-21.3,-71.5,-35.1C-64.3,-48.9,-52.1,-59.6,-38.6,-63.3C-25.1,-67,-10.3,-63.7,1.3,-65.9C12.9,-68.1,23.9,-63.1,33.4,-57.2Z",
    "M36.7,-62.5C47.4,-56.2,55.9,-45.7,62.9,-33.9C69.9,-22.1,75.4,-9,76.1,5.2C76.8,19.4,72.7,34.7,63.9,46.6C55.1,58.5,41.6,67,27,72.1C12.4,77.2,-3.3,78.9,-18.5,76.2C-33.7,73.5,-48.4,66.4,-59.3,55.1C-70.2,43.8,-77.3,28.3,-79.8,11.9C-82.3,-4.5,-80.2,-21.8,-73.1,-36.4C-66,-51,-54,-62.9,-40.2,-67.9C-26.4,-72.9,-10.8,-71,1.1,-72.9C13,-74.8,26,-68.8,36.7,-62.5Z",
    "M30.1,-52.7C38.5,-47.1,44.6,-37.7,51.4,-27.4C58.2,-17.1,65.7,-5.9,67.6,7C69.5,19.9,65.8,34.5,57.3,45.8C48.8,57.1,35.5,65.1,21.1,69.7C6.7,74.3,-8.8,75.5,-23.2,72C-37.6,68.5,-50.9,60.3,-60.4,48.7C-69.9,37.1,-75.6,22.1,-77.1,6.3C-78.6,-9.5,-75.9,-26.1,-68,-39.5C-60.1,-52.9,-47,-63.1,-33.1,-66.2C-19.2,-69.3,-4.5,-65.3,4.8,-73.2C14.1,-81.1,21.7,-58.3,30.1,-52.7Z",
  ],
};

// Typeless pastel colors - 50% more visible
const blobColors = {
  blue: "rgba(218, 232, 251, 0.54)", // section-blue
  lavender: "rgba(232, 228, 243, 0.47)", // section-lavender
  cream: "rgba(234, 227, 209, 0.40)", // section-cream
};

export default function BlobMorphBackground() {
  const blob1Ref = useRef<SVGPathElement>(null);
  const blob2Ref = useRef<SVGPathElement>(null);
  const blob3Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    const blobs = [
      { ref: blob1Ref, paths: blobPaths.blob1, duration: 25000 },
      { ref: blob2Ref, paths: blobPaths.blob2, duration: 30000 },
      { ref: blob3Ref, paths: blobPaths.blob3, duration: 35000 },
    ];

    const animations: Animation[] = [];

    blobs.forEach(({ ref, paths, duration }) => {
      if (ref.current) {
        const keyframes = paths.map((d) => ({ d }));
        // Add first path at end for seamless loop
        keyframes.push({ d: paths[0] });

        const animation = ref.current.animate(keyframes, {
          duration,
          iterations: Infinity,
          easing: "ease-in-out",
        });
        animations.push(animation);
      }
    });

    return () => {
      animations.forEach((anim) => anim.cancel());
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large blur filter for soft, diffused effect */}
      <svg className="absolute" width="0" height="0">
        <defs>
          <filter id="blob-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="60" />
          </filter>
        </defs>
      </svg>

      {/* Blob 1 - Top Left - Blue */}
      <svg
        className="absolute -top-[20%] -left-[15%] w-[70%] h-[70%]"
        viewBox="-100 -100 200 200"
        preserveAspectRatio="xMidYMid slice"
        style={{ filter: "url(#blob-blur)" }}
      >
        <path
          ref={blob1Ref}
          d={blobPaths.blob1[0]}
          fill={blobColors.blue}
          transform="scale(1.2)"
        />
      </svg>

      {/* Blob 2 - Bottom Right - Lavender */}
      <svg
        className="absolute -bottom-[25%] -right-[20%] w-[80%] h-[80%]"
        viewBox="-100 -100 200 200"
        preserveAspectRatio="xMidYMid slice"
        style={{ filter: "url(#blob-blur)" }}
      >
        <path
          ref={blob2Ref}
          d={blobPaths.blob2[0]}
          fill={blobColors.lavender}
          transform="scale(1.3)"
        />
      </svg>

      {/* Blob 3 - Center Right - Cream */}
      <svg
        className="absolute top-[10%] -right-[10%] w-[60%] h-[60%]"
        viewBox="-100 -100 200 200"
        preserveAspectRatio="xMidYMid slice"
        style={{ filter: "url(#blob-blur)" }}
      >
        <path
          ref={blob3Ref}
          d={blobPaths.blob3[0]}
          fill={blobColors.cream}
          transform="scale(1.1)"
        />
      </svg>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10" />
    </div>
  );
}
