export default function AppLogo({size}: { size?: number }) {
    return <span style={{fontSize: size ?? 24}} className="font-extrabold text-decoration-none text-green-700 tracking-widest">FOODII</span>
}