export default function PublicPage({ params }: { params: { handle: string } }) {
  const handle = params.handle;

  return (
    <main style={{ padding: 24 }}>
      <h1>@{handle}</h1>
      <p>This is the public page for {handle}.</p>
    </main>
  );
}
