export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex-1 px-6 py-10 lg:px-12">
      <div className="mx-auto w-full max-w-3xl">{children}</div>
    </main>
  );
}
