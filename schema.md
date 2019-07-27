## DB Schema for Badgelor

### users
```json
{
    "_id" : "t9vBwZAFMGpPx2LgN",
    "createdAt" : ISODate("2019-07-22T20:32:41.874Z"),
    "services" : {
        "password" : {
            "bcrypt" : "$2a$10$nq8GmyUvSYk.G8dB6/soruXTsmacXydivuPRgve3zk.V3Ce.9YGh2"
        },
        "resume" : {
            "loginTokens" : [
                {
                    "when" : ISODate("2019-07-22T20:32:41.895Z"),
                    "hashedToken" : "+HLgDC2oDz4fAX4k1isum86roqdjsPfV0HVtbhmDbqE="
                }
            ]
        }
    },
    "emails" : [
        {
            "address" : "badge01@uni-koblenz.de",
            "verified" : false
        }
    ],
    "profile" : {
        "lastLogin" : ISODate("2019-07-22T20:32:41.731Z")
    },
    "role" : "applicant",
    "obfID" : ""
}

```
### profile
```json
{
    "_id" : "JDjynAqhbZEGzKPEJ",
    "userAccountID" : "t9vBwZAFMGpPx2LgN",
    "firstName" : "User:",
    "lastName" : "badge01",
    "campus" : "koblenz",
    "occupation" : "Alumni",
    "imageURL" : "/images/avatar.png"
}
```
### campus
```json
{
    "_id"         : "DzgaLmCtjTPHxm7ER",
    "name"        : "koblenz",
    "description" : "",
    "createdBy"   : "nizam@uni-koblenz.de",
    "createdAt"   : ISODate("2019-07-07T20:47:06.427Z")
}
```
### faculty
```json
{
    "_id" : "HjKYyAfodJfGSwRqQ",
    "name" : "Fb 1 - Bildungswissenschaften",
    "description" : "",
    "campusID" : "DzgaLmCtjTPHxm7ER",
    "createdBy" : "nizam@uni-koblenz.de",
    "createdAt" : ISODate("2019-07-07T20:47:06.525Z")
}
```
### institute
```json
{
    "_id" : "JhAmcgu746mf6Ak66",
    "name" : "Institut für Grundschulpädagogik",
    "description" : "",
    "campusID" : "DzgaLmCtjTPHxm7ER",
    "facultyID" : "HjKYyAfodJfGSwRqQ",
    "createdBy" : "nizam@uni-koblenz.de",
    "createdAt" : ISODate("2019-07-07T20:47:06.590Z")
}
```
### course
```json
{
    "_id" : "NouvSEtEteTa4R7iR",
    "name" : "test course",
    "description" : "",
    "campusID" : "DzgaLmCtjTPHxm7ER",
    "facultyID" : "HjKYyAfodJfGSwRqQ",
    "instituteID" : "JhAmcgu746mf6Ak66",
    "createdBy" : "nizam@uni-koblenz.de",
    "createdAt" : ISODate("2019-07-22T20:37:15.792Z")
}
```
### level
```json
{
    "_id"         : "A8bEmweqQXTdtkBs5",
    "name"        : "Experten",
    "description" : "",
    "createdBy"   : "nizam@uni-koblenz.de",
    "createdAt"   : ISODate("2019-07-07T20:47:06.898Z")
}
```
### competency
```json
{
    "_id" : "F8hs7xd3qK4mZsSM6",
    "name" : "Analysieren / Reflektieren",
    "description" : "",
    "createdBy" : "nizam@uni-koblenz.de",
    "createdAt" : ISODate("2019-07-07T20:47:06.993Z")
}
```
### tool
```json
{
  "_id"         : "geBE8WjGvMXvGrAqx",
  "name"        : "Institut für Grundschulpädagogik",  
  "createdBy"   : "userID",
  "createdAT"   : ISODate("2017-11-11T13:06:32.481Z"),
}
```
