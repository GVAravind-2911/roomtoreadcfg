import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                user_id: { label: "User ID", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.user_id || !credentials?.password) {
                    throw new Error('Please enter all fields');
                }

                const connection = await pool.getConnection();
                try {
                    const [users]: any[] = await connection.execute(
                        'SELECT * FROM users WHERE user_id = ?',
                        [credentials.user_id]
                    );

                    const user = users[0];

                    if (!user) {
                        throw new Error('No user found');
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isValid) {
                        throw new Error('Invalid password');
                    }

                    return {
                        id: user.user_id,
                        name: user.name,
                        email: user.user_id,
                        role: user.user_type
                    };
                } finally {
                    connection.release();
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth',
    },
    session: {
        strategy: "jwt",
    }
});

export { handler as GET, handler as POST };