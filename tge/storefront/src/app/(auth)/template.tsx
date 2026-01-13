export default function Template({ children }: { children: React.ReactNode }) {
    // Override global template animation. Render children directly.
    return <>{children}</>;
}
