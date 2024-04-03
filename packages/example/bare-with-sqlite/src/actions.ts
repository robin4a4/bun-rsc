"use server";
import {db} from "./db.ts";

export async function addTodo(formData: FormData) {
    const text = String(formData.get("text"));
    const query = db.query(
"INSERT INTO todos (text) VALUES ($text)",
    );
    query.all({
        $text: text,
    });
}
