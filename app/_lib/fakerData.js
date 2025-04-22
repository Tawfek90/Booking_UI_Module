// app/_lib/fakerData.js
import { faker } from "@faker-js/faker";

let photoList = [];
for (let index = 1; index <= 30; index++) {
  photoList = [...photoList, `/doctor${index}.jpg`];
}

export default function generateMockDoctors(count = 50) {
  return Array.from({ length: count }, (_, i) => {
    // pick one of your 5 photos at random
    const photo = faker.helpers.arrayElement(photoList);

    // Number of appointment slots (3–5)
    const numAppointments = faker.number.int({ min: 3, max: 5 });
    const slots = faker.date.betweens({
      from: new Date(),
      to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      count: numAppointments,
    });
    const availability = slots.map((slot) => ({
      day: slot.toLocaleDateString("en-US", { weekday: "long" }),
      date: slot.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: slot.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    }));

    return {
      id: i + 1,
      name: faker.person.fullName(),
      specialty: faker.helpers.arrayElement([
        "Cardiology",
        "Dermatology",
        "Neurology",
        "Pediatrics",
        "Orthopedics",
        "Oncology",
      ]),
      rating: faker.number.int({ min: 1, max: 10, precision: 0.1 }),
      availability,
      location: `${faker.location.city()}, ${faker.location.country()}`,
      photo, // <-- from your public folder
    };
  });
}
