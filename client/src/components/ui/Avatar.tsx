type AvatarProps = {
  image?: string;
  size?: number;
  alt?: string;
};

export default function Avatar({
  image,
  size = 40,
  alt = "User avatar",
}: AvatarProps) {
  return (
    <div
      className="overflow-hidden rounded-full bg-gray-200 flex items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
    >
      {image ? (
        <img
          src={image}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="text-xs text-gray-500">?</span>
      )}
    </div>
  );
}
