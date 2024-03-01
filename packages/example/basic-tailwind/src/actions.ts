"use server";

export async function addTodo(formData: FormData) {
  // fake latency
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const currentTodosFile = await Bun.file(`${process.cwd()}/todos.txt`);
  let currentTodos = "No todos yet";
  if (await currentTodosFile.exists()) {
    currentTodos = await currentTodosFile.text();
  }
  await Bun.write("./todos.txt", `${currentTodos}\n${formData.get("todo")}`);
}
