export function Nav({currentRoute}: {currentRoute: string}) {
    return (
            <ul className="bg-white shadow-lg rounded-lg flex gap-4 p-2 mb-16 container mx-auto">
                <li className={`px-8 py-4 rounded-lg ${currentRoute === "home" ? "bg-gray-100" : null}`}>
                    <a href="/">Counter</a>
                </li>
                <li className={`px-8 py-4 rounded-lg ${currentRoute === "form" ? "bg-gray-100" : null}`}>
                    <a href="/form">Form</a>
                </li>
                <li className={`px-8 py-4 rounded-lg ${currentRoute === "data" ? "bg-gray-100" : null}`}>
                    <a href="/data">Data fetching</a>
                </li>
            </ul>
    );
}