#####CASHIERS DB

>npm run dev - запустить приложение
npm run web - запустить веб интерфейс
##

![alttext](/screenShots/console.JPG)

![](/screenShots/cashier.JPG "cashier")

![](/screenShots/cashiersInShops.JPG "cashier")
<br>
![](/screenShots/schedule.JPG "cashier")
<br>
![](/screenShots/shop.JPG "cashier")
<br>
![](/screenShots/web1.JPG "cashier")

|        | API ENDPOINTS                 |                     |                                                                                                                              |
|--------|-------------------------------|---------------------|------------------------------------------------------------------------------------------------------------------------------|
| GET    | /api/cashiers                 | get all cashiers    |                                                                                                                              |
| GET    | /api/cashiers/id              | get cashier by id   |                                                                                                                              |
| POST   | /api/cashiers                 | create cashier      | req.body {name:'Ivan Ivanovic', age:22, sex: 'male', yearsOfExperience: 4, worksInSHifts: ['dayShift'] }                     |
| PUT    | /api/cashiers                 | update cashier      |                                                                                                                              |
| DELETE | /api/cashiers/id              | delete cashier      |                                                                                                                              |
| POST   | /api/cashiers/hire            | hire cashier        | req.body {cashierId: 8, shopId: 3}                                                                                           |
| POST   | /api/cashiers/fire            | fire cashier        |                                                                                                                              |
| GET    | /api/cashiers/targetcashiers1 |                     |                                                                                                                              |
| GET    | /api/cashiers/targetcashiers2 |                     |                                                                                                                              |
|        |                               |                     |                                                                                                                              |
|        | /api/shops                    | GET/PUT/POST/DELETE | req.body {name:'ATB',city: "Odessa", address:"shevenka 100"}                                                                 |
|        | /api/cashregs                 | GET/PUT/POST/DELETE | req.body {number: 1, shopId: 3}                                                                                              |
|        | /api/workschedule             | GET/PUT/POST/DELETE | req.body {dayOfTheWeek: "Monday",shiftName: "nightShift",  time: "23:00-07:00", cashierId: 3, cashRegisterId: 1, shopId: 8 } |

