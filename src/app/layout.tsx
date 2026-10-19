import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phòng Mạch — Công nghệ vừa vặn với bạn",
  description:
    "Khám phá phụ kiện và thiết bị công nghệ được chọn lọc cho công việc, giải trí và góc sống của bạn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
