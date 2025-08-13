// components/LoopVideo.tsx
export default function LoopVideo({ src }: { src: string }) {
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      className="w-full aspect-[2/1] object-cover"
    />
  );
}
