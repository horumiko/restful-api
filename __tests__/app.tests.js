const { spec } = require('pactum');

describe('Retrieving data', () => {

    test('should yield HTTP status code 200', async () => {

        await spec()
            .get('http://localhost:8082/items/')
            .expectStatus(200)
    });

    test('should return all items', async () => {

        await spec()
            .get('http://localhost:8082/items')
            .expectStatus(200)
            .expectJson([
                {
                    "_id": "656a718f638c2b484b899285",
                    "id": 3,
                    "displayName": "s",
                    "assignedUser": 7,
                    "cartId": 3,
                    "__v": 0
                },
                {
                    "_id": "656a71aa638c2b484b899287",
                    "id": 8,
                    "displayName": "s",
                    "assignedUser": 3,
                    "cartId": 3,
                    "__v": 0
                },
                {
                    "_id": "657cb6746ef7af3401810116",
                    "id": 9,
                    "displayName": "item 9",
                    "assignedUser": 1,
                    "cartId": 3,
                    "__v": 0
                },
                {
                    "_id": "657cd8f261faad5019008ac7",
                    "id": 666,
                    "displayName": "AAAAAAA",
                    "assignedUser": 1,
                    "cartId": 0,
                    "__v": 0
                }
            ])
    });

    test('should item with id 4', async () => {

        await spec()
            .get("http://localhost:8082/item")
            .withHeaders('Content-Type', 'application/json')
            .withBody(`
            {
              "itemId": 3
            }
          `)
            .expectStatus(200)
            .expectJson(
                {
                    "_id": "656a718f638c2b484b899285",
                    "id": 3,
                    "displayName": "s",
                    "assignedUser": 7,
                    "cartId": 3,
                    "__v": 0
                }
            )
    });
    // test('should add item with id 666 and check it', async () => {

    //     await spec()
    //         .post("http://localhost:8082/add_item")
    //         .withHeaders('Content-Type', 'application/json')
    //         .withBody(`
    //         {
    //             "id": 666,
    //             "displayName": "AAAAAAA",
    //             "assignedUser": 1,
    //             "cartId": 0
    //         }
    //       `)
    //         .expectStatus(200)

    //     await spec() 
    //         .get("http://localhost:8082/item")
    //         .withHeaders('Content-Type', 'application/json')
    //         .withBody(`
    //             {
    //             "itemId": 666
    //             }
    //         `)  
    //         .expectJsonMatch(
    //                 "displayName", "AAAAAAA"
    //         )
    // });

    test('check assignment', async () => {

        await spec()
            .post("http://localhost:8082/assignment")
            .withHeaders('Content-Type', 'application/json')
            .withBody(`
            {
                "userId": 7,
                "cartId": 1,
                "itemId": 3
            }
          `)
            .expectStatus(202)
        
        await spec()
            .get("http://localhost:8081/user")
            .withHeaders('Content-Type', 'application/json')
            .withBody(`
            {
              "userId": 7
            }
          `)
          .expectJson(
            {
                "_id": "657cc43625339fcd5f13d1c5",
                "id": 7,
                "type": "user",
                "displayName": "Yulia",
                "cart": 1,
                "img": "user6.png",
                "__v": 0
            }
        )
            .expectStatus(200)    
    });
});

