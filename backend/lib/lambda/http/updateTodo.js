import 'source-map-support/register';
export const handler = async (event) => {
    const todoId = event.pathParameters.todoId;
    const updatedTodo = JSON.parse(event.body);
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    return undefined;
};
//# sourceMappingURL=updateTodo.js.map