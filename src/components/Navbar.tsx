import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <ul className="flex list-none p-0">
                <li className="mx-4">
                    <Link href="/">
                        <p className="text-white">Home</p>
                    </Link>
                </li>
                <li className="mx-4">
                    <Link href="/login">
                        <p className="text-white">Login</p>
                    </Link>
                </li>
                <li className="mx-4">
                    <Link href="/signup">
                        <p className="text-white">Signup</p>
                    </Link>
                </li>
                <li className="mx-4">
                    <Link href="/inventory">
                        <p className="text-white">Inventory</p>
                    </Link>
                </li>
                <li className="mx-4">
                    <Link href="/checkin">
                        <p className="text-white">Check In</p>
                    </Link>
                </li>
                <li className="mx-4">
                    <Link href="/checkout">
                        <p className="text-white">Check Out</p>
                    </Link>
                </li>
                <li className="mx-4">
                    <Link href="/analytics">
                        <p className="text-white">Analytics</p>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;