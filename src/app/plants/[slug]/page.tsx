import Image from 'next/image'
import { client } from '../../../sanity/client'
import { PortableText, PortableTextComponents } from '@portabletext/react'

const PLANT_QUERY = `*[_type == "plant" && slug.current == $slug][0]{
  _id,
  name,
  description,
  "imageUrl": image.asset->url,
  fact,
  careGuide->{
    title,
    wateringInstructions,
    lightRequirements,
    soilType,
    fertilizer,
    difficulty
  }
}`

// NOTE: params is a Promise in the latest Next.js
type PlantPageProps = {
  params: Promise<{ slug: string }>
}

const portableTextComponents: PortableTextComponents = {
  block: {
    // Normal paragraphs
    normal: ({ children }) => <p className="mb-3 leading-relaxed text-gray-200">{children}</p>,
    // Example custom heading inside fact text
    h2: ({ children }) => (
      <h2 className="mt-6 mb-2 text-xl font-semibold text-emerald-300">{children}</h2>
    ),
  },
  marks: {
    // Bold text
    strong: ({ children }) => (
      <strong className="font-semibold text-emerald-200">{children}</strong>
    ),
    // Links
    link: ({ value, children }) => {
      const href = value?.href || '#'
      const isExternal = href.startsWith('http')
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer noopener' : undefined}
          className="underline decoration-emerald-400 underline-offset-2 hover:text-emerald-300"
        >
          {children}
        </a>
      )
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-3 ml-6 list-disc space-y-1 text-gray-200">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-3 ml-6 list-decimal space-y-1 text-gray-200">{children}</ol>
    ),
  },
}

export default async function PlantPage({ params }: PlantPageProps) {
  const { slug } = await params // 🔹 unwrap the Promise

  const plant = await client.fetch(PLANT_QUERY, { slug }) // 🔹 now $slug is provided

  if (!plant) {
    return <main className="p-8">Plant not found</main>
  }

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="mb-4 text-3xl font-bold">{plant.name}</h1>

      {plant.imageUrl && (
        <Image
          src={plant.imageUrl}
          alt={plant.name}
          width={600}
          height={400}
          className="mb-6 rounded-lg object-cover"
        />
      )}

      <p className="text-gray-700">{plant.description}</p>

      <section className="mt-6 rounded-2xl border border-emerald-700/40 bg-emerald-900/40 p-4 sm:p-5">
        <h2 className="mb-2 flex items-center gap-2 text-base font-semibold text-emerald-200">
          <span>🧪 Plant Facts</span>
        </h2>
        <div className="text-sm leading-relaxed text-emerald-50/90">
          <PortableText value={plant.fact} components={portableTextComponents} />
        </div>
      </section>

      {plant.careGuide && (
        <section className="mt-8 rounded-xl border border-emerald-800/50 bg-emerald-900/20 p-6">
          <h2 className="mb-3 text-lg font-semibold text-emerald-100">Care Guide</h2>

          <dl className="space-y-2 text-sm text-emerald-50">
            {plant.careGuide.wateringInstructions && (
              <div className="flex gap-2">
                <dt className="font-semibold text-emerald-200">Watering:</dt>
                <dd>{plant.careGuide.wateringInstructions}</dd>
              </div>
            )}

            {plant.careGuide.lightRequirements && (
              <div className="flex gap-2">
                <dt className="font-semibold text-emerald-200">Light:</dt>
                <dd className="capitalize">{plant.careGuide.lightRequirements}</dd>
              </div>
            )}

            {plant.careGuide.soilType && (
              <div className="flex gap-2">
                <dt className="font-semibold text-emerald-200">Soil:</dt>
                <dd>{plant.careGuide.soilType}</dd>
              </div>
            )}

            {plant.careGuide.fertilizer && (
              <div className="flex gap-2">
                <dt className="font-semibold text-emerald-200">Fertilizer:</dt>
                <dd>{plant.careGuide.fertilizer}</dd>
              </div>
            )}

            {plant.careGuide.difficulty && (
              <div className="flex gap-2">
                <dt className="font-semibold text-emerald-200">Difficulty:</dt>
                <dd className="capitalize">{plant.careGuide.difficulty}</dd>
              </div>
            )}
          </dl>
        </section>
      )}
    </main>
  )
}
