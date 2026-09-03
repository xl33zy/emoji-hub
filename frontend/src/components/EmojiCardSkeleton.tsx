import { Skeleton } from './Skeleton'

interface EmojiCardSkeletonProps {
    size?: 'default' | 'large'
}

export function EmojiCardSkeleton({ size = 'default' }: EmojiCardSkeletonProps) {
    const isLarge = size === 'large'
    return (
        <div
            aria-hidden="true"
            className={`flex flex-col gap-3 rounded-[10px] border-[1.5px] border-line bg-paper-raised ${isLarge ? 'p-5' : 'p-4'}`}
        >
            <div className="flex justify-end gap-2">
                <Skeleton className="h-[18px] w-[18px]" />
                <Skeleton className="h-[18px] w-[18px]" />
            </div>
            <Skeleton className={isLarge ? 'h-[72px] w-[72px]' : 'h-[42px] w-[42px]'} />
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-4 w-2/5" />
            <div className="mt-2 border-t border-line pt-3">
                <Skeleton className="h-3 w-1/3" />
            </div>
        </div>
    )
}