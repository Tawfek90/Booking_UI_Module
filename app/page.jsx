import Doctors from "@/components/doctors/Doctors";
export default function Home() {
  return (
    <main
      className="container mx-auto"
      role="main"
      aria-label="Doctors directory"
    >
      <Doctors />
    </main>
  );
}
