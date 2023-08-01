export default function shortenHash(s: string) {
    const N = s.length;
    return s.slice(0, 5) + "..." + s.slice(N-5,N)
}