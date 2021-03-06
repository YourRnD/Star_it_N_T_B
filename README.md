# Star_It API

## Описание контроллера customer

### POST /api/customer/signup
#### Пример тела запроса на сервер
    "payload": {
      "name": "Test user",
      "email": "test.mail@gmail.com",
      "password": "Qwerty_12345"
    }
#### Пример ответа от сервера
    status: 200
    message: 'Registration completed successfully!',
    user: {
      id,
      name,
      email
    }
    
### GET /api/customer/signin
#### Пример тела запроса на сервер
    "payload": {
      "email": "test.mail@gmail.com",
      "password": "Qwerty_12345"
    }
#### Пример ответа от сервера
    status: 200
    message: 'User found!',
    token,
    user: {
      id,
      name,
      email
    }    
        
### GET /api/customer/
#### Пример ответа от сервера
    status: 200
    message: 'Users found!',
    users: [
      {
        id,
        name,
        email
      }, 
      {
        id,
        name,
        email
      }, 
      ...
    ]
      
### GET /api/customer/:id
#### Пример ответа от сервера
    status: 200
    message: 'User found!',
    user: {
      id,
      name,
      email
    }    
        
### DELETE /api/customer/:id
#### Пример ответа от сервера
    status: 200
    message: 'User deleted successfully!',
    user: {
      id,
      name,
      email
    }  
           
### PUT /api/customer/:id
#### Пример тела запроса на сервер
    "payload": {
      "name": "Test user",
      "email": "test.mail@gmail.com",
      "password": "Qwerty_12345"
    }
#### Пример ответа от сервера
    status: 200
    message: 'User deleted successfully!',
    user: {
      id,
      name,
      email
    }  
    
## Описание контроллера feedback    

### POST /api/feedback/
#### Пример тела запроса на сервер
    "payload": {
      "idPoint": pointId,
      "rating": 1,
      "notes": 'Test feedback'
    }
#### Пример ответа от сервера
    status: 200
    message: 'Review added successfully!',
    feedback: {
      id,
      date,
      notes,
      rating,
      user: {
        id,
        name,
        email
      },
      point: {
        id,
        name,
        addres
      }
    }
        
### GET /api/feedback/
#### Пример ответа от сервера
    status: 200
    message: 'Feedback find!',
    feedback: [
      {
        id,
        date,
        notes,
        rating,
        user: {
          id,
          name,
          email
        },
        point: {
          id,
          name,
          addres
        }
      }, 
      {
        id,
        date,
        notes,
        rating,
        user: {
          id,
          name,
          email
        },
        point: {
          id,
          name,
          addres
        }
      }, 
      ...
    ]
      
### GET /api/feedback/:id
#### Пример ответа от сервера
    status: 200
    message: 'Feedback found!',
    feedback: {
      id,
      date,
      notes,
      rating,
      user: {
        id,
        name,
        email
      },
      point: {
        id,
        name,
        addres
      }
    }   
        
### DELETE /api/feedback/:id
#### Пример ответа от сервера
    status: 200
    message: 'Feedback deleted successfully!',
    feedback: {
      id,
      date,
      notes,
      rating,
      user: {
        id,
        name,
        email
      },
      point: {
        id,
        name,
        addres
      }
    }
           
### PUT /api/feedback/:id
#### Пример тела запроса на сервер
    "payload": {
      "idPoint": pointId,
      "rating": 1,
      "notes": 'Test feedback'
    }
#### Пример ответа от сервера
    status: 200
    message: 'Feedback deleted successfully!',
    feedback: {
      id,
      date,
      notes,
      rating,
      user: {
        id,
        name,
        email
      },
      point: {
        id,
        name,
        addres
      }
    } 
    
## Описание контроллера point   
    
### POST /api/point/
#### Пример тела запроса на сервер
    "payload": {
      "name": "Test point",
      "address": "Address test point"
    }
#### Пример ответа от сервера
    status: 200
    message: 'Point added successfully!',
    point: {
      id,
      name,
      addres
    }
        
### GET /api/point/
#### Пример ответа от сервера
    status: 200
    message: 'Points find!',
    points: [
      {
        id,
        name,
        addres
      }, {
        id,
        name,
        addres
      }, 
      ...
    ]
      
### GET /api/point/:id
#### Пример ответа от сервера
    status: 200
    message: 'Point found!',
    point: {
      id,
      name,
      addres
    }  
        
### DELETE /api/point/:id
#### Пример ответа от сервера
    status: 200
    message: 'Point deleted successfully!',
    point: {
      id,
      name,
      addres
    }
           
### PUT /api/point/:id
#### Пример тела запроса на сервер
    "payload": {
      "name": "Test point",
      "address": "Address test point"
    }
Пример ответа от сервера
    status: 200
    message: 'Point deleted successfully!',
    point: {
      id,
      name,
      addres
    }
