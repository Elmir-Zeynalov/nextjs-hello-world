import Link from 'next/link'
import { type SanityDocument } from 'next-sanity'
import { client } from '../../sanity/client'

const PLANTS_QUERY = `*[_type == "plant"]{
  _id,
  name,
  slug,
  description,
  "imageUrl": image.asset->url,
  careGuide->{
    title,
    watering,
    sunlight
  }
}`

const options = { next: { revalidate: 30 } }

export default async function IndexPage() {
  const plants = await client.fetch<SanityDocument[]>(PLANTS_QUERY, {}, options)

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <p className="mb-4 text-xl">Hei, jeg heter Elmir og jeg elsker planter!</p>

      <h2 className="mb-4 text-2xl font-bold">Plant Collection</h2>

      <ul className="space-y-6">
        {plants.map((plant: any) => (
          <li key={plant._id} className="rounded-lg border p-4 shadow-sm">
            {plant.imageUrl && (
              <img
                src={plant.imageUrl}
                alt={plant.name}
                className="mb-3 h-48 w-full rounded-md object-cover"
              />
            )}

            <h3 className="text-xl font-semibold">{plant.name}</h3>
            <p className="text-gray-700">{plant.description}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
