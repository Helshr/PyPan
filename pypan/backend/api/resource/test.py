from flask import Flask, request

app = Flask(__name__)

todo = {}

@app.route('/todo/<int:todo_id>', methods=['GET'])
def get_todo(todo_id):
    return {todo_id: todo[todo_id]}

@app.route('/todo', methods=['GET'])
def get_todo_list():
    print("DEBUG: {}".format(list(todo.values())))
    return {"result": list(todo.values())}

@app.route('/todo/<int:todo_id>', methods=['PUT'])
def create_todo(todo_id):
    data = request.form['data']
    todo[todo_id] = data
    return {todo_id: todo[todo_id]}

@app.route('/todo/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    del todo[todo_id]
    return 'delete success: {}'.format(todo_id)

@app.route('/todo/<int:todo_id>', methods=['PATCH'])
def update_todo(todo_id):
    data = request.form['data']
    todo[todo_id] = data
    return {todo_id: todo[todo_id]}
