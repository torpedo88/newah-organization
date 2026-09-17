import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://efojgqzsqfivdgfeinuj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmb2pncXpzcWZpdmRnZmVpbnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4Mjc1MjksImV4cCI6MjA5OTQwMzUyOX0.dai1E85lLhJUZSU04HQzZQQc5zVXiuJSVajhrIALqNk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDb() {
  try {
    const { data, error } = await supabase.from("registrations").select("*").limit(1);
    if (error) {
      console.error("Table check error:", error.message);
      console.error("Error code:", error.code);
      return;
    }
    console.log("✓ Table exists. Data:", data);
  } catch (err) {
    console.error("Connection error:", err.message);
  }
}

checkDb();
