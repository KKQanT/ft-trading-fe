export function shortenHash(s: string, slice: number = 5) {
    const N = s.length;
    return s.slice(0, slice) + "..." + s.slice(N-slice,N)
}

export const roundToTwoDigits = (num: number) => {
    return Math.round(num*100)/100
} 