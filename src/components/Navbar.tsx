import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
    const { data: session } = useSession();

    const handleSignOut = async () => {
        if (session?.user?.id) {
            try {
                await fetch('/api/user-activity', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: session.user.id,
                        activity_type: 'logout'
                    }),
                });
            } catch (error) {
                console.error('Failed to log logout activity:', error);
            }
        }
        await signOut({ callbackUrl: '/' });
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/">
                    <p className="text-white text-xl font-bold">Room To Read</p>
                </Link>

                <ul className="flex list-none p-0 items-center">
                    {!session && (
                        <li className="mx-4">
                            <Link href="/auth">
                                <p className="text-white hover:text-gray-300">Login</p>
                            </Link>
                        </li>
                    )}

                    {session?.user?.role === 'user' && (
                        <>  
                            <li className="mx-4">
                                <Link href="/user/dashboard">
                                    <p className="text-white hover:text-gray-300">Dashboard</p>
                                </Link>
                            </li>
                            <li className="mx-4">
                                <Link href="/user/books/checkout">
                                    <p className="text-white hover:text-gray-300">Check Out</p>
                                </Link>
                            </li>
                            <li className="mx-4">
                                <Link href="/user/books/checkin">
                                    <p className="text-white hover:text-gray-300">Check In</p>
                                </Link>
                            </li>
                            
                        </>
                    )}

                    {session?.user?.role === 'admin' && (
                        <>
                            <li className='mx-4'>
                                <Link href="/admin/dashboard">
                                    <p className="text-white hover:text-gray-300">Dashboard</p>
                                </Link>
                            </li>

                            <li className="mx-4">
                                <Link href="/admin/inventory">
                                    <p className="text-white hover:text-gray-300">Inventory</p>
                                </Link>
                            </li>
                            <li className="mx-4">
                                <Link href="/admin/user-history">
                                    <p className="text-white hover:text-gray-300">User History</p>
                                </Link>
                            </li>
                            <li className="mx-4">
                                <Link href="/admin/analytics">
                                    <p className="text-white hover:text-gray-300">Analytics</p>
                                </Link>
                            </li>
                        </>
                    )}

                    {session && (
                        <>
                            <li className="mx-4">
                                <span className="text-gray-300">
                                    {session.user.name} ({session.user.role})
                                </span>
                            </li>
                            <li className="mx-4">
                                <button
                                    onClick={handleSignOut}
                                    className="text-white hover:text-gray-300"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;