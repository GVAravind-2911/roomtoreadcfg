import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    DATABASE_URL:"mysql://root:root@localhost:3306/codeforgood",
    DB_HOST:"localhost",
    DB_USER:"root",
    DB_PASSWORD:"root",
    DB_NAME:"codeforgood",
    DB_PORT:"3306",
  },
  
};

export default nextConfig;
