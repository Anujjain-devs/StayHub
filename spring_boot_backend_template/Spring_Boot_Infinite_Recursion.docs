# Spring Boot me Infinite Recursion / Circular Dependency ko Hinglish me Samjho

## Infinite Recursion kya hota hai?

**Infinite Recursion** Spring Boot me mostly tab hota hai jab hum **JSON Serialization** karte time do entities ke beech **bidirectional relationship (two-way relation)** bana dete hain.

Simple language me:

> Jab Entity A ke andar Entity B ka reference ho aur Entity B ke andar wapas Entity A ka reference ho, toh Jackson ObjectMapper dono objects ko baar-baar convert karta rehta hai aur ek infinite loop ban jata hai.

Iske result me:

```text
java.lang.StackOverflowError
```

aata hai.

---

# 1. Root Cause: Bidirectional Entity Relationship

Maan lo hamare paas `User` aur `Booking` entity hai.

Ek customer ki multiple bookings ho sakti hain.

Aur ek booking ka ek customer hota hai.

Relationship:

```text
User  -------- Booking
 1              *
```

Matlab:

* Ek User ke paas bahut saari Bookings hain.
* Ek Booking ek User se related hai.

---

## User.java

```java
@Entity
public class User {

    private Long id;
    private String firstName;

    @OneToMany(mappedBy = "customer")
    private List<Booking> bookings;

}
```

Yaha:

```java
private List<Booking> bookings;
```

ka matlab:

"Ye user ki saari bookings hain."

Example:

```text
John User

Bookings:
    Booking 1
    Booking 2
    Booking 3
```

---

## Booking.java

```java
@Entity
public class Booking {

    private Long id;
    private LocalDate checkInDate;

    @ManyToOne
    @JoinColumn(name="customer_id")
    private User customer;

}
```

Yaha:

```java
private User customer;
```

ka matlab:

"Ye booking kis user ne ki hai."

---

Ab problem kaha aati hai?

Dono ek dusre ko point kar rahe hain.

```text
User
 |
 |---- bookings
          |
          |
       Booking
          |
          |
       customer
          |
          |
        User
```

Ye cycle ban gayi.

---

# 2. Jackson Infinite Loop kaise create karta hai?

Spring Boot me jab hum Controller se Entity return karte hain:

```java
@GetMapping("/{id}")
public Booking getBooking(@PathVariable Long id){

    return bookingRepository.findById(id).get();

}
```

Toh Spring internally Jackson ObjectMapper ka use karta hai.

Jackson ka kaam:

Java Object ko JSON me convert karna.

Example:

Java:

```text
Booking Object
```

convert hoga:

```json
{
 "id":1,
 "checkInDate":"2026-09-01"
}
```

---

Ab Jackson Booking ko convert karna start karta hai.

## Step 1:

Jackson dekhta hai:

```java
Booking
```

Iske andar fields hain:

```text
id
checkInDate
customer
```

Toh JSON banega:

```json
{
"id":1,
"checkInDate":"2026-09-01",
"customer":{}
}
```

---

## Step 2:

Ab customer field ke andar User object hai.

Jackson User ko convert karega:

```json
{
"id":10,
"firstName":"John",
"bookings":[]
}
```

---

## Step 3:

Ab User ke andar:

```java
List<Booking> bookings
```

hai.

Jackson bolega:

"Achha, User ki bookings bhi JSON me convert karni hai."

Toh wo wapas Booking 1 par jayega.

---

## Step 4:

Booking ke andar fir:

```java
customer
```

milega.

Fir User.

Fir Booking.

Fir User.

Aur ye loop chalta rahega.

Final JSON kuch aisa banne lagega:

```json
{
"id":1,
"customer":{
    "id":10,
    "firstName":"John",
    "bookings":[
        {
        "id":1,
        "customer":{
            "id":10,
            "bookings":[
                {
                 "id":1,
                 "customer":{
                    ...
                 }
                }
            ]
        }
        }
    ]
}
}
```

Ye kabhi khatam nahi hoga.

Isliye:

```text
StackOverflowError
```

aata hai.

---

# 3. DTO Circular Dependency ko kaise solve karta hai?

DTO ka full form:

**Data Transfer Object**

DTO ka purpose:

> Database entities ko directly API response me return na karna.

Instead:

Entity se required data lekar ek simple object banana.

---

Example:

Entity:

```java
Booking
```

ke andar:

```text
User object
Room object
PgListing object
```

hain.

Agar direct return kiya:

```text
Booking
   |
   User
      |
      Booking
```

Cycle ban jayega.

---

Lekin DTO:

```java
public class BookingResponseDTO {

    private Long id;
    private LocalDate checkInDate;
    private String customerName;
    private String roomNumber;
    private String pgName;

}
```

Dekho:

Yaha:

```java
private String customerName;
```

hai.

Na ki:

```java
private User customer;
```

---

Matlab:

Pehle:

```text
Booking
 |
 User
 |
 Booking
 |
 User
```

Cycle tha.

Ab:

```text
BookingDTO

id
checkInDate
customerName
roomNumber
pgName
```

Bas simple values hain.

Koi object reference nahi hai.

Isliye Jackson:

```text
BookingDTO
   |
   |
   End
```

kar deta hai.

---

# DTO use karne ke fayde

## 1. Circular dependency solve hoti hai

Entity relationship ka cycle break ho jata hai.

---

## 2. Extra data expose nahi hota

Maan lo User entity:

```java
User {
    id,
    name,
    email,
    password,
    role
}
```

Agar direct return kiya:

```json
{
"name":"John",
"email":"abc@gmail.com",
"password":"12345"
}
```

Password bhi expose ho sakta hai.

DTO me sirf required fields:

```json
{
"name":"John"
}
```

---

## 3. API response customize kar sakte hain

Database structure aur API response alag rakh sakte hain.

Example:

Database:

```text
first_name
last_name
```

API:

```json
{
"fullName":"John Smith"
}
```

---

# 4. Alternative Solutions (Entity level)

Agar kabhi Entity directly return karni pade toh Jackson annotations use kar sakte hain.

---

## 1. @JsonIgnore

Example:

```java
@OneToMany(mappedBy="customer")
@JsonIgnore
private List<Booking> bookings;
```

Meaning:

Jackson bolega:

"Is field ko JSON me convert mat karo."

Output:

```json
{
"id":10,
"name":"John"
}
```

Bookings nahi aayengi.

---

## 2. @JsonManagedReference and @JsonBackReference

Ye parent-child relationship ke liye use hota hai.

### User.java

```java
@OneToMany(mappedBy="customer")
@JsonManagedReference
private List<Booking> bookings;
```

Parent side.

---

### Booking.java

```java
@ManyToOne
@JsonBackReference
private User customer;
```

Child side.

Meaning:

* User ke andar Booking show hogi.
* Booking ke andar User dobara show nahi hoga.

---

JSON:

```json
{
"id":10,
"name":"John",
"bookings":[
 {
  "id":1
 }
]
}
```

Loop break ho gaya.

---

## 3. @JsonIdentityInfo

Isme Jackson object ko baar-baar pura print nahi karta.

ID reference use karta hai.

Example:

```java
@JsonIdentityInfo(
generator = ObjectIdGenerators.PropertyGenerator.class,
property="id"
)
```

Output:

```json
{
"id":1,
"customer":{
"id":10,
"name":"John",
"bookings":[1]
}
}
```

Booking ko repeat karne ki jagah ID de deta hai.

---

# Industry Best Practice

Production applications me generally:

```text
Controller
     |
     |
    DTO
     |
     |
   Service
     |
     |
 Repository
     |
     |
 Entity
```

flow follow kiya jata hai.

Direct:

```text
Controller
     |
   Entity
```

avoid karte hain.

---

## StayHub ke context me:

Tumhare project me:

```text
User
 |
PgListing
 |
Room
 |
Booking
 |
Payment
```

relationships hain.

Agar bidirectional mapping banate:

Example:

```text
User
  |
 bookings
  |
Booking
  |
 user
```

toh infinite recursion ka risk hota.

Isliye tumne **Unidirectional JPA Relationship + DTO approach** choose kiya hai.

Ye industry-level approach hai kyunki:

✅ Circular dependency avoid hoti hai
✅ API response control me hota hai
✅ Sensitive fields hide kar sakte ho
✅ Database design aur API design separate rehte hain
✅ Jackson serialization safe rehta hai
