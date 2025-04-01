import Seat from "./Seat";

export default function AllSeats() {
  const seats = [...Array(400)].map((_, index) => {
    const row = Math.floor(index / 20) + 1;
    const col = (index % 20) + 1;
    return {
      identifier: `R${row}_C${col}`,
      row,
      column: col,
    };
  });

  return (
    <section className="grid grid-cols-20 gap-2 p-4">
      {seats.map((seat, index) => (
        <Seat seat={seat} key={index} />
      ))}
    </section>
  );
}
