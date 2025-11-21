"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

type Book = {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  averageRating: number;
  subscriptionRequired: boolean;
  audioLink: string;
};

export function useLibrary() {
  const auth = getAuth();
  const db = getFirestore();

  const user = auth.currentUser;

  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSavedBooks([]);
      setFinishedBooks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const savedRef = collection(db, "customers", user.uid, "savedBooks");
    const finishedRef = collection(db, "customers", user.uid, "finishedBooks");

    const unsubSaved = onSnapshot(savedRef, (snap) => {
      const docs = snap.docs.map((d) => d.data() as Book);
      setSavedBooks(docs);
    });

    const unsubFinished = onSnapshot(finishedRef, (snap) => {
      const docs = snap.docs.map((d) => d.data() as Book);
      setFinishedBooks(docs);
    });

    setLoading(false);

    return () => {
      unsubSaved();
      unsubFinished();
    };
  }, [db, user]);

  const saveBook = useCallback(
    async (book: Book) => {
      if (!user) return;

      await setDoc(doc(db, "customers", user.uid, "savedBooks", book.id), book);
    },
    [db, user]
  );

  const removeSavedBook = useCallback(
    async (bookId: string) => {
      if (!user) return;

      await deleteDoc(doc(db, "customers", user.uid, "savedBooks", bookId));
    },
    [db, user]
  );

  const markFinished = useCallback(
    // loose param type so AudioPlayer can pass its PlayerBook
    async (book: any) => {
      if (!user || !book?.id) return;

      await setDoc(doc(db, "customers", user.uid, "finishedBooks", book.id), {
        ...book,
        completedAt: new Date().toISOString(),
      });
    },
    [db, user]
  );

  const isSaved = useCallback(
    (bookId: string) => savedBooks.some((b) => b.id === bookId),
    [savedBooks]
  );

  const isFinished = useCallback(
    (bookId: string) => finishedBooks.some((b) => b.id === bookId),
    [finishedBooks]
  );

  const numberOfSavedBooks = savedBooks.length;
  const numberOfFinishedBooks = finishedBooks.length;

  return {
    loading,
    savedBooks,
    finishedBooks,
    saveBook,
    removeSavedBook,
    markFinished,
    isSaved,
    isFinished,
    numberOfSavedBooks,
    numberOfFinishedBooks,
  };
}
