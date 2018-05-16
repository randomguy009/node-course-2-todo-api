const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos} = require('./seed/seed');
const {users, populateUsers} = require('./seed/seed');

const {ObjectID} = require('mongodb');

beforeEach(populateTodos);
beforeEach(populateUsers);

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
                  return done(err);
                }
            
            
        // console.log(todos[1]._id.toHexString());
        // Todo.findById(todos[0]._id.toHexString()).then((todo) => {
        //     console.log(todo)
        // });
            
        Todo.findById(id).then((todo) => {
           // console.log(todo);
            expect(todo).toNotExist();
            done();
        }).catch((e) => {
            done(e);
        });
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


describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) =>{
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'something@gmail.com';
        var password = 'password';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toExist();
            })
            .end((err) => {
                if(err) {
                    return done(err);
                }
            

            User.findOne({email}).then((user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            })
        });
    });

    it('should return validation errors if request invalid', (done) => {
        var email = 'somethinggmail.com';
        var password = 'pa';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', (done) => {
        var email = 'naidu@gmail.com';
        var password = 'pa';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);

    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
         });
    });

    it('should reject invaild login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: 'okay'
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toNotExist();
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toEqual(0);
                done();
            }).catch((e) => done(e));
     });
    });
});