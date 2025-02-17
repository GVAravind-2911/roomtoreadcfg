import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="mt-auto w-full bg-gray-100 text-center py-4 shadow-inner">
            <p>&copy; {new Date().getFullYear()} Room to Read</p>
        </footer>
    );
};

export default Footer;