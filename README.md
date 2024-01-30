[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=13216059&assignment_repo_type=AssignmentRepo)

[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=13040515&assignment_repo_type=AssignmentRepo)
# I-Project

# Mangalistku API Documentation
> url : afr-project.online

## Models :

_User_
- fullName : string (optional)
- email : string, unique (required)
- password : string (required)
- imgUrl : string
- phoneNumber : string
- subscribe : boolean



_List_
- title : string (required)
- description : string (required)
- price : integer (required, min)
- imgUrl : string (required)
- categoryId : integer (required)
- authorId : integer (required)

## Relationship :

>### **One-to-Many**
Relasi antara `User` dan `Cuisines` adalah one to many dimana satu user dapat mempunyai banyak cuisine. Sama halnya dengan relasi antara `Category` dan `Cuisines`, satu category dapat dimiliki oleh banyak cuisine.

## Endpoints :

List of available endpoints:
​
- `POST /login`
- `POST /register`


And routes below need authentication
> The request user should be match with grocery.UserId (exception for Admin role)
- `GET /` 
- `GET /details/:mangaId`
- `GET /profile`
- `PUT /update-profile`
- `PATCH /update-profile`
- `POST /generate-midtrans-token`
- `PATCH /subscription`
- `GET /list`
- `DELETE /list/:id`


&nbsp;

## 1. POST /register

Request:

- body:
```json
{
  "email": "string",
  "password": "string",
  "imgUrl": "string",
  "phoneNumber": "string",
  "subscribe": "boolean"
}
```

_Response (201 - Created)_

```json
{
    "id": "integer",
    "email": "string"
}
```

_Response (400 - Bad Request)_

```json
{
    "message": "Email is required"
}
OR
{
    "message": "Invalid email format"
}
OR
{
    "message": "Email must be unique"
}
OR
{
    "message": "Password is required"
}
```

_Response (401 - Unauthorized)_

```json
{
    "message": "Error authentication"
}
```

_Response (403 - Forbidden)_

```json
{
    "message": "You are not authorized"
}
```

&nbsp;

## 2. POST /login

Request:

- body:
```json
{
    "email": "string",
    "password": "string"
}
```

_Response (200 - OK)_
  ​

```json
{
    "id": "integer",
    "subscribe": "boolean",
    "access_token": "string"
}
```


_Response (401 - Unauthorized)_

```json
{
    "message": "Error invalid email/password"
}
```

&nbsp;

## 3. GET /

Description: Get Manga data based on Ranking
Request:

- headers:
```json
{
    "X-MAL-CLIENT-ID": "CLIENT_ID"
}
```

_Response (200 - OK)_
  ​

```json
"data": [
        {
            "node": {
                "id": "integer",
                "title": "string",
                "main_picture": {
                    "medium": "string",
                    "large": "string"
                },
                "alternative_titles": {
                    "synonyms": [
                        "string"
                    ],
                    "en": "string",
                    "ja": "string"
                },
                "start_date": "date"
            },
            "ranking": {
                "rank": "integer"
            }
        },

        ......
]
```

_Response (401 - Unauthorized)_
  ​

```json
{
    "message": "Error authentication"
}
```

&nbsp;

## 4. GET /details/:mangaId

Description: Get details of selected manga
Request:

- headers:
```json
{
    "X-MAL-CLIENT-ID": "CLIENT_ID"
}
```

_Response (200 - OK)_
- body:
```json
{
    "id": "integer",
    "title": "string",
    "main_picture": {
        "medium": "string",
        "large": "string"
    },
    "alternative_titles": {
        "synonyms": "string",
        "en": "string",
        "ja": "string"
    },
    "start_date": "date",
    "end_date": "date",
    "synopsis": "string",
    "mean": "integer",
    "rank": "integer",
    "popularity": "integer",
    "created_at": "date",
    "updated_at": "date",
    "media_type": "string",
    "status": "string",
    "genres": [
        {
            "id": "integer",
            "name": "string"
        },
       ...
    ],
    "num_volumes": "integer",
    "num_chapters": "integer",
    "authors": "array",
    "related_anime": "array",
    "related_manga": "array",
    "recommendations": "array"
}
```

_Response (401 - Unauthorized)_
  ​

```json
{
    "message": "Error authentication"
}
```

&nbsp;

## 5. GET /profile

Description : Get user data

Request:

- headers:
```json
{
    "Authorization": "Bearer <access_token>"
}
```

_Response (201 - Created)_
```json
{
    {
    "id": "integer",
    "fullName": "string",
    "email": "string",
    "password": "string",
    "phoneNumber": "string",
    "imgUrl": "string",
    "subscribe": "boolean",
    "createdAt": "date",
    "updatedAt": "date"
    }
}
```


_Response (401 - Unauthorized)_
  ​

```json
{
    "message": "Error authentication"
}
```


&nbsp;

## 6.  PUT /update-profile

description: 
  Update user profile

Request:

- headers:
```json
{
    "Authorization": "Bearer <access_token>"
}
```
- body:
```json
{
    {
    "fullName": "string",
    "phoneNumber": "string",
    "imgUrl": "string",
    }
}

```
_Response (200 - OK)_

```json
{
  "message": "Successfully update the profile with ID <user id>"
}
```

_Response (401 - Forbidden)_

```json
{
  "message": "Error authentication"
}
```

&nbsp;


## 7. PATCH /update-profile

Description: Update profile picture

Request:

- headers:
```json
{
     "Authorization": "Bearer <access_token>"
}
```

  ​
- body:
```json
{
    "imgUrl" : "file"
}
```
_Response (200 - OK)_

```json
{
  "message": "<user full name> profile picture has been updated"
}
```

_Response (401 - Unauthorized)_
  ​

```json
{
    "message": "Error authentication"
}
```

&nbsp;

## 8. GET /list

Description: Get all manga owned by user

Request:

- headers:
```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
[
        {
            "node": {
                "id": "integer",
                "title": "string",
                "main_picture": {
                    "medium": "string",
                    "large": "string"
                },
                "start_date": "date"
            },
            "ranking": {
                "rank": "integer"
            }
        },

        ......
]
```

&nbsp;

## 9. POST /list/add/:mangaId

Request:

- headers:
```json
{
  "Authorization": "Bearer <access_token>"
}
```

- params:
```json
{
    "mangaId"
}
```

_Response (201 - Created)_

```json
{
    {
        "id": 1,
        "name": "Super Besar 1",
        "description": "Nasi + Ayam + Minuman",
        "price": 50000,
        "imgUrl": "https://files.kfcku.com/uploads/media/dummy/food/kfc-web_super-besar1_l.png",
        "categoryId": 2,
        "authorId": req.user.id
    }
}
```

_Response (400 - Validation Error)_
```json
{
    "message": "Name is required"
}
OR
{
    "message": "Description is required"
}
OR
{
    "message": "Price is required"
}
OR
{
    "message": "Minimum price of product must be greater than Rp 10,000.00"
}
OR
{
    "message": "Product picture is required"
}
OR
{
    "message": "Category is required"
}
OR
{
    "message": "Author is required"
}
```

_Response (401 - Unauthorized)_
  ​

```json
{
    "message": "Error authentication"
}
```

&nbsp;

## 9. PUT /cuisines/:id

Description : Update cuisines details (Non-admin user can only update their own cuisine/item)
Request:

- headers:
```json
{
  "Authorization": "Bearer <access_token>"
}
```

- params:
```json
{
  "id": "integer"
}
```
- body:
```json
{
    {
        "id": 1,
        "name": "Super Besar 1",
        "description": "Nasi + Ayam + Minuman",
        "price": 50000,
        "imgUrl": "https://files.kfcku.com/uploads/media/dummy/food/kfc-web_super-besar1_l.png",
        "categoryId": 2
    }
}
```


_Response (200 - OK)_

```json
{
  "message": "Cuisine has been updated"
}
```

_Response (400 - Validation Error)_
```json
{
    "message": "Name is required"
}
OR
{
    "message": "Description is required"
}
OR
{
    "message": "Price is required"
}
OR
{
    "message": "Minimum price of product must be greater than Rp 10,000.00"
}
OR
{
    "message": "Product picture is required"
}
OR
{
    "message": "Category is required"
}
```

_Response (401 - Unauthorized)_
  ​

```json
{
    "message": "Error authentication"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "error not found"
}
```

&nbsp;

## 10. PATCH /cuisines/:id

Description : Updating picture of the cuisine (Non-admin user can only update their own cuisine/item)
Request:

- headers:
```json
{
  "Authorization": "Bearer <access_token>"
}
```

- params:
```json
{
  "id": "integer"
}
```
- file upload:
```json
{
    {
        "image" : "./image.jpg"
    }
}
```


_Response (200 - OK)_

```json
{
  "message": "Image <cuisine name> has been updated"
}
```

_Response (400 - Validation Error)_
```json
{
    "message": "Product picture is required"
}
```

_Response (401 - Unauthorized)_
  ​

```json
{
    "message": "Error authentication"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "error not found"
}
```

&nbsp;


## 11.  DELETE /cuisines/:id

description: 
  Delete one of the cuisines by id (Non-admin user can only delete their own cuisine/item)

Request:

- headers:
```json
{
    "Authorization": "Bearer <access_token>"
}
```

- params:
```json
{
    "id": "integer"
}
```

_Response (200 - OK)_

```json
{
  "message": "<category name> success to delete"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Data not found"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized"
}
```

&nbsp;


&nbsp;
## Global Error

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```