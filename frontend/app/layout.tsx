import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statmon",
  description: "Turn your GitHub or Pinterest profile into a stat card.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
