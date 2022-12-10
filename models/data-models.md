# MONGO data modeling

## Relationship types

## 1 to 1 
a user that can only have on email registed
--> one user to one email 

```json
// user 
{
    name: 'Luffy',
    address: {
        Ocean : 'East Blue',
        vilage : 'Fushia Village'
    }
}
```

## 1 to many
when a user could have multiple addresses 

```json
// user 
{
    name: 'Zoro',
    address: [
        {
        Ocean : 'East Blue',
        vilage : 'Fushia Village'
     },
    {
        Ocean : 'Grand Line',
        vilage : 'Sword island'
     },

    ]
}
```


## many to many 
--> multiple books with multiple authors
```json

// books
    {
        title: 'My book',
        author: [id1,id2, id3]
    }

// author

    {
        author : 'King',
        books: [id4, id6, id9]
        
    }
```

## Structuring realtionships 



## Embedded

--> first case where the address is embedded on the 
user 


## Normalized data model (reference)
--> whe have documents refering to each other 

--> having ids to refering to another documents
