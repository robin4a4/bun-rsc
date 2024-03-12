export function Nav({currentRoute}: {currentRoute: string}) {
    return (
            <ul className="bg-white shadow-lg rounded-lg flex gap-16 p-8">
                <li>
                    <a className={`px-16 py-8 rounded-lg ${currentRoute === "home" ? "bg-gray-100" : null}`} href="/">Home</a>
                </li>
                <li>
                    <a className={`px-16 py-8 rounded-lg ${currentRoute === "form" ? "bg-gray-100" : null}`} href="/form">Form</a>
                </li>
                <li>
                    <a className={`px-16 py-8 rounded-lg ${currentRoute === "data" ? "bg-gray-100" : null}`} href="/data">Data</a>
                </li>
            </ul>
    );
}