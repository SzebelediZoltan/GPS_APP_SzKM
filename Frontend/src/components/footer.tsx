export default function Footer() {

    return (
        <footer className="p-10 border-t-5">
            <div className="flex justify-between">
                <div>
                    <h1 className="">GP ASS App</h1>
                    <p>A legjobb navigációs alkalmazás</p>
                </div>
                <div>
                    <p>About</p>
                    <p>Features</p>
                    <p>Pricing</p>
                    <p>Contact</p>
                </div>
                <div>
                    <p>Documentation</p>
                    <p>FAQ</p>
                    <p>Support</p>
                </div>
                <div>
                    <p>X twitter</p>
                    <p>LinkedIn</p>
                    <p>YouTube</p>
                </div>
            </div>
            <div className="flex justify-between mt-2">
                <div>
                    <p>URAMMM ATYÁÁM</p>
                </div>
                <div className="flex gap-15">
                    <p>Privacy Policy</p>
                    <p>Terms</p>
                </div>
            </div>
        </footer>
    )
}