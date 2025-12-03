import Link from "next/link";
import { type SanityDocument } from "next-sanity";

import { client } from "../sanity/client";

const PLANTS_QUERY = `*[_type == "plant"]{
  _id,
  name,
  description,
  "imageUrl": image.asset->url,
  careGuide->{
    title,
    watering,
    sunlight
  }
}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const plants = await client.fetch<SanityDocument[]>(PLANTS_QUERY, {}, options);

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <p className="text-xl mb-4">
        Hei, jeg heter Elmir og jeg elsker planter!
      </p>
      <img
      src="https://images.squarespace-cdn.com/content/v1/514f916de4b04c6ad186e00d/1588779228945-F4WGW8ZN8X8N1KKSUCGX/STAYIN_ALIVE_PLANT.gif?format=2500w"
      alt="Plant dancing"
      style={{ width: "400px" }}
      className="mb-6"
      />

      <h2 className="text-2xl font-bold mb-4">Plant Collection</h2>

<ul className="space-y-6">
  {plants.map((plant: any) => (
    <li key={plant._id} className="border p-4 rounded-lg shadow-sm">
      {plant.imageUrl && (
        <img
          src={plant.imageUrl}
          alt={plant.name}
          className="w-full h-48 object-cover rounded-md mb-3"
        />
      )}

      <h3 className="text-xl font-semibold">{plant.name}</h3>
      <p className="text-gray-700">{plant.description}</p>
    </li>
  ))}
</ul>


    </main>
  );
}