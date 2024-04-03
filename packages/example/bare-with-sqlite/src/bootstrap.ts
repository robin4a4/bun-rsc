import { db } from "./db.ts";

export default () => {
	const createSubscriptionQuery = db.query(
		"CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, text TEXT);",
	);
	createSubscriptionQuery.run();
};