import Recommended from "@/components/Recommended";
import Selected from "@/components/Selected";
import Suggested from "@/components/Suggested";

export default async function ForYou() {
  const resSelected = await fetch(
    "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
  );
  const selectedBooks = await resSelected.json();

  const resRecommended = await fetch(
    "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"
  );

  const recommendedBooks = await resRecommended.json();

  const resSuggested = await fetch(
    "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"
  );
  const suggestedBooks = await resSuggested.json();

  return (
    <>
      <Selected selectedBooks={selectedBooks} />
      <Recommended recommendedBooks={recommendedBooks} />
      <Suggested suggestedBooks={suggestedBooks} />
    </>
  );
}
