import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Authored",
  description: "One page per person. Editable in life. Private if you want."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{ fontFamily: "system-ui, -apple-system, Arial" }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
