const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {ObjectID} = require('mongodb');

const todos = [{
    _id: new ObjectID(),
    text: 'First'
}, {
    _id: new ObjectID(),
    text: 'Second',
    completed: true,
    completedAt: 11313
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
    Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST / todos', () => {
    it('should create a new todo', (done) => {
        var text ='Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => {
                    console.log('Something went wrong');
                });
            });
    });

    it('Dont create another todo', (done) => {
        request(app)
            .post('/todos')
            .send()
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
        
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
        
                }).catch((e) => {
                    console.log(e);
                });
            });
    });
    
});

describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)
            .get('todos')
            .expect(200)
            .expect((res) => {
                expect((res.body.todos.length).toBe(2))
            })
            .end(() => done());
            
    });
});

describe('GET/todos/id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    })
});

describe('DELETE /todos/:id', () => {
    it('should delete todo doc', (done) => {
        var id = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${todos[1]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }
            });
            
        // console.log(todos[1]._id.toHexString());
        // Todo.findById(todos[0]._id.toHexString()).then((todo) => {
        //     console.log(todo)
        // });
            
        Todo.findById(id).then((todo) => {
           // console.log(todo);
            expect(todo).toNotExist();
            done();
        }).catch((e) => {
            console.log(e);
        });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete(`/todos/fuckyou`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH todos/:id', () => {
    it('should update the todo', (done) => {
        var id = todos[0]._id.toHexString();

        var dummy = {
            text: 'Come on now',
            completed: true
        }

        request(app)
            .patch(`/todos/${id}`)
            .send(dummy)
            .expect(200)
            .expect((res) => {
                // expect(res.body.todo.text).toBe('Come on now');
                // expect(res.body.todo.completed).toBe(true);
                 expect(res.body.todo.completedAt).toBeA('number');

                expect(res.body.todo).toInclude(dummy);
            })
            .end(done);
    });
    
    it('should clear some shit', (done) => {
        var id = todos[1]._id.toHexString();

        var dummy ={
            text: 'shut the fuck up',
            completed: false
        };

        request(app)
            .patch(`/todos/${id}`)
            .send(dummy)
            .expect(200)
            .expect((res) => {
                // expect(res.body.todo.text).toBe('shut the fuck up');
                // expect(res.body.todo.completed).toBe(false);
                 expect(res.body.todo.completedAt).toNotExist();

                expect(res.body.todo).toInclude(dummy);
            })
            .end(done);
    });
});