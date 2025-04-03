"use client";
import { useEffect, useState } from "react";
import Seat from "./Seat";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AllSeats() {
  const [isSeatsFetched, setIsSeatsFetched] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [seats, setSeats] = useState<
    { identifier: string; row: number; column: number; isBooked?: boolean }[]
  >([]);
  // const [bookings, setBookings] = useState<any[]>([]);

  const fetchSeats = () =>
    setSeats(
      [...Array(400)].map((_, index) => {
        const row = Math.floor(index / 20) + 1;
        const col = (index % 20) + 1;
        return {
          identifier: `R${row}_C${col}`,
          row,
          column: col,
        };
      })
    );

  useEffect(() => {
    fetchSeats();
    setIsSeatsFetched(true);
  }, []);

  const fetchBookings = async () => {
    setIsFetching(true);
    try {
      const querySnapshot = await getDocs(collection(db, "bookings"));
      const bookingData = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id, // Firestore document ID
            ...doc.data(),
          } as any)
      );
      // setBookings(bookingData);

      const newSeats = seats.map((s) => ({
        ...s,
        isBooked: bookingData.some((b) => b.seat === s.identifier),
      }));
      console.log({ newSeats });

      setSeats(newSeats);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
    setIsFetching(false);
  };

  useEffect(() => {
    if (isSeatsFetched) fetchBookings();
  }, [isSeatsFetched]);

  // if (isFetching) return; // loading screen;

  return (
    <section className="grid grid-cols-20 gap-2 p-4">
      {seats.map((seat, index) => (
        <Seat seat={seat} key={index} fetchBookings={fetchBookings} />
      ))}
    </section>
  );
}
