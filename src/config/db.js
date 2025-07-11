import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from '../db/schema.js';
import { ENV } from "./env.js";

const sql = neon(ENV.DATABASE_URI);
export const db = drizzle(sql, { schema });

