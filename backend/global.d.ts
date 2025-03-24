declare global {
    namespace NodeJS {
        interface ProcessEnv {
        DB_PORT: string;
        DATABASE_URL: string;
        }
    }
}

export {};
  