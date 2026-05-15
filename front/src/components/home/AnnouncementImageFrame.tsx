import { Box, Image } from "@mantine/core";

interface AnnouncementImageFrameProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  radius?: number;
  padding?: number;
  withBorder?: boolean;
}

export default function AnnouncementImageFrame({
  src,
  alt,
  width = "100%",
  height = 260,
  radius = 12,
  padding = 0,
  withBorder = false,
}: AnnouncementImageFrameProps) {
  return (
    <Box
      style={{
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        background: "#ffffff",
        border: withBorder ? "1px solid #e5e7eb" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding,
      }}
    >
      <Image
        src={src}
        alt={alt}
        h="100%"
        w="100%"
        fit="contain"
        style={{
          display: "block",
          background: "#ffffff",
        }}
      />
    </Box>
  );
}