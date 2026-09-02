import { useParams } from 'react-router-dom'

export function EmojiDetailPage() {
    const { slug } = useParams<{ slug: string }>()

    return (
        <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-8">
            <h1 className="font-display text-3xl text-ink">Emoji: {slug}</h1>
            {/* TODO: детали эмодзи, LLM-описание настроения, копирование кода */}
        </div>
    )
}