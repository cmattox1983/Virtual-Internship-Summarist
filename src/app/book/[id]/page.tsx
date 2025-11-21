import BookData from "./BookData";

type Params = {
  params: { id: string };
};

export default async function Book({ params }: Params) {
  const { id } = params;

  const res = await fetch(
    `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`,
    { cache: "no-store" }
  );

  const book = await res.json();

  if (!book) {
    return <div>Loading...</div>;
  }

  return <BookData book={book} />;
}
