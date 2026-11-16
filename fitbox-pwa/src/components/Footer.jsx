export default function Footer() {
    return (
        <footer className="mt-auto border-t border-line bg-flour/60 py-10 pb-28 text-center text-sm text-ink/70 md:pb-10">
            <div className="mx-auto max-w-6xl space-y-2 px-4">
                <span className="font-display text-xl text-leaf">FitBox</span>
                <p className="hand text-base text-ink/60">Eat well, live well.</p>
                <p className="text-xs text-ink/50">
                    &copy; {new Date().getFullYear()} FitBox &bull; Rosita Dwi Ahyani (21120124120043)
                </p>
            </div>
        </footer>
    )
}