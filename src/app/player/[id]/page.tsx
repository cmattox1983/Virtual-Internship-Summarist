import PlayerData from "./PlayerData";

type Params = {
  params: { id: string };
};

export default async function Player({ params }: Params) {
  const { id } = params;

  const res = await fetch(
    `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`,
    { cache: "no-store" }
  );

  const book = await res.json();

  if (!book) return <div>Loading...</div>;

  return <PlayerData book={book} />;
}
