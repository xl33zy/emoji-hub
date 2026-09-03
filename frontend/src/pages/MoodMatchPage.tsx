import { PageIntro } from '../components/PageIntro'
import { EmojiCard } from '../components/EmojiCard'
import { useCategories } from '../hooks/useCategories'
import { useMoodMatch } from '../hooks/useMoodMatch'
import { ThinkingDots } from '../components/ThinkingDots'

const EXAMPLES = [
    'stressed before a big deadline',
    'lazy sunday morning, no plans at all',
    'nervous but excited about a trip',
]

export function MoodMatchPage() {
    const { categories } = useCategories()
    const { text, setText, status, matches, query, errorMessage, submit } = useMoodMatch()

    function handleSubmit() {
        const trimmed = text.trim()
        if (!trimmed) return
        submit(trimmed)
    }

    return (
        <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-8">
            <PageIntro title="Mood Match">
                Describe how you're feeling and we'll find emoji that match.
            </PageIntro>

            <div className="border-b border-line pb-6">
                <label htmlFor="moodInput" className="mb-1.5 block text-sm font-medium text-ink">
                    What's on your mind
                </label>
                <textarea
                    id="moodInput"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g. wired after too much coffee and behind on everything"
                    style={{
                        backgroundImage:
                            'linear-gradient(var(--color-paper-raised), var(--color-paper-raised)), linear-gradient(to right, var(--mood-field-from), var(--mood-field-to))',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box',
                    }}
                    className="min-h-[104px] w-full resize-y rounded-[8px] border-2 border-transparent bg-paper-raised px-4 py-3.5 text-[15px] text-ink placeholder:text-ink-soft transition-shadow duration-150 focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--mood-field-from)_18%,transparent)] focus-visible:outline-none"
                />

                <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-ink">Or start from one of these</span>
                        <div className="flex flex-wrap gap-2">
                            {EXAMPLES.map((example) => (
                                <button
                                    key={example}
                                    type="button"
                                    onClick={() => setText(example)}
                                    className="rounded-full border border-line px-3.5 py-1.5 font-body text-[13.5px] text-ink-soft transition-colors hover:border-accent-indigo hover:bg-[color-mix(in_srgb,var(--color-accent-indigo)_10%,transparent)] hover:text-accent-indigo focus-visible:border-accent-indigo focus-visible:bg-[color-mix(in_srgb,var(--color-accent-indigo)_10%,transparent)] focus-visible:text-accent-indigo focus-visible:outline-none"
                                >
                                    {example}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={status === 'loading'}
                        className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        Find my emojis
                    </button>
                </div>
            </div>

            <div className="pt-2">
                {status === 'loading' && (
                    <p className="min-h-[1.5em] py-5 font-mono text-[13px] text-ink-soft">
                        <ThinkingDots label="Looking through the catalog" />
                    </p>
                )}
                {status === 'rate-limited' && (
                    <p className="min-h-[1.5em] py-5 font-mono text-[13px] text-ink-soft">
                        Too many requests — try again in a minute.
                    </p>
                )}
                {status === 'error' && (
                    <p className="min-h-[1.5em] py-5 font-mono text-[13px] text-ink-soft">
                        Something went wrong{errorMessage ? `: ${errorMessage}` : ''}. Try again.
                    </p>
                )}

                {status === 'success' && (
                    <div className="py-2 pb-10">
                        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                            Matches for <span className="text-[13px] font-normal capitalize tracking-normal text-ink">&ldquo;{query}&rdquo;</span>
                        </h2>
                        {matches.length === 0 ? (
                            <p className="text-sm text-ink-soft">
                                No close matches this time — try describing it a little differently.
                            </p>
                        ) : (
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(228px,1fr))] gap-[18px]">
                                {matches.map((match) => (
                                    <EmojiCard key={match.emoji.slug} emoji={match.emoji} categories={categories} reason={match.reason} from="mood-match" />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}